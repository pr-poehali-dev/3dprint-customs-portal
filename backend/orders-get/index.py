import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Получение списка заявок для админ-панели
    Args: event - dict с httpMethod, headers для авторизации
          context - объект с request_id и другими параметрами
    Returns: JSON список заявок или ошибка
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    headers = event.get('headers', {})
    admin_token = headers.get('x-admin-token') or headers.get('X-Admin-Token')
    expected_token = os.environ.get('ADMIN_TOKEN', 'default-secret-token')
    
    print(f"Received token length: {len(admin_token) if admin_token else 0}")
    print(f"Expected token length: {len(expected_token)}")
    print(f"Received repr: {repr(admin_token[:20]) if admin_token else 'None'}")
    print(f"Expected repr: {repr(expected_token[:20])}")
    
    if not admin_token or admin_token.strip() != expected_token.strip():
        return {
            'statusCode': 401,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Unauthorized', 'debug': f'Token received: {bool(admin_token)}'})
        }
    
    dsn = os.environ.get('DATABASE_URL')
    
    conn = psycopg2.connect(dsn)
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT 
            id, customer_type, company_name, inn, email, phone,
            length, width, height, plastic_type, color, infill,
            quantity, description, file_url, file_name, status,
            created_at, updated_at
        FROM orders
        ORDER BY created_at DESC
    ''')
    
    columns = [desc[0] for desc in cursor.description]
    orders = []
    
    for row in cursor.fetchall():
        order_dict = dict(zip(columns, row))
        if order_dict.get('created_at'):
            order_dict['created_at'] = order_dict['created_at'].isoformat()
        if order_dict.get('updated_at'):
            order_dict['updated_at'] = order_dict['updated_at'].isoformat()
        orders.append(order_dict)
    
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({'orders': orders})
    }