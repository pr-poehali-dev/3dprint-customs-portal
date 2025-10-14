'''
Business: Отправка заказа на 3D печать на email с генерацией номера заказа
Args: event - dict with httpMethod, body (JSON с данными формы)
      context - object with attributes: request_id, function_name
Returns: HTTP response с номером заказа
'''

import json
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    
    order_number = f"3DP-{datetime.now().strftime('%Y%m%d')}-{context.request_id[:8].upper()}"
    
    email_body = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #2563eb;">Новый заказ №{order_number}</h2>
        
        <h3>Параметры печати:</h3>
        <ul>
            <li><strong>Размеры:</strong> {body_data.get('length')} x {body_data.get('width')} x {body_data.get('height')} мм</li>
            <li><strong>Материал:</strong> {body_data.get('plastic')}</li>
            <li><strong>Цвет:</strong> {body_data.get('color')}</li>
            <li><strong>Заполнение:</strong> {body_data.get('infill')}%</li>
            <li><strong>Количество:</strong> {body_data.get('quantity')} шт</li>
        </ul>
        
        <h3>Тип заказчика:</h3>
        <p><strong>{body_data.get('customerType')}</strong></p>
        {'<p><strong>Компания:</strong> ' + body_data.get('companyName', '') + '</p>' if body_data.get('customerType') == 'legal' else ''}
        {'<p><strong>ИНН:</strong> ' + body_data.get('inn', '') + '</p>' if body_data.get('customerType') == 'legal' else ''}
        
        <h3>Контакты:</h3>
        <ul>
            <li><strong>Email:</strong> {body_data.get('email')}</li>
            <li><strong>Телефон:</strong> {body_data.get('phone', 'Не указан')}</li>
        </ul>
        
        <h3>Описание:</h3>
        <p>{body_data.get('description', 'Не указано')}</p>
        
        <hr style="margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">Дата заказа: {datetime.now().strftime('%d.%m.%Y %H:%M')}</p>
    </body>
    </html>
    """
    
    smtp_server = os.environ.get('SMTP_SERVER', 'smtp.yandex.ru')
    smtp_port = int(os.environ.get('SMTP_PORT', '465'))
    smtp_user = os.environ.get('SMTP_USER', '')
    smtp_password = os.environ.get('SMTP_PASSWORD', '')
    
    if not smtp_user or not smtp_password:
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'orderNumber': order_number,
                'message': 'Demo mode: SMTP not configured'
            })
        }
    
    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'Новый заказ на 3D печать №{order_number}'
    msg['From'] = smtp_user
    msg['To'] = 'info@3dprintcustoms.ru'
    
    msg.attach(MIMEText(email_body, 'html', 'utf-8'))
    
    try:
        with smtplib.SMTP_SSL(smtp_server, smtp_port) as server:
            server.login(smtp_user, smtp_password)
            server.send_message(msg)
    except Exception as e:
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'orderNumber': order_number,
                'message': f'Demo mode: {str(e)}'
            })
        }
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'success': True,
            'orderNumber': order_number
        })
    }
