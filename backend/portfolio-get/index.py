import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Получение списка работ портфолио
    Args: event - dict с httpMethod
          context - объект с request_id
    Returns: JSON список работ портфолио
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
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
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT id, title, description, image_url, display_order, is_visible, created_at
        FROM portfolio
        WHERE is_visible = true
        ORDER BY display_order ASC, created_at DESC
    ''')
    
    columns = [desc[0] for desc in cursor.description]
    portfolio = []
    
    for row in cursor.fetchall():
        item_dict = dict(zip(columns, row))
        if item_dict.get('created_at'):
            item_dict['created_at'] = item_dict['created_at'].isoformat()
        portfolio.append(item_dict)
    
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({'portfolio': portfolio})
    }
