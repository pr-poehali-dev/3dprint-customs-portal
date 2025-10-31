'''
Business: Отправка заказа на 3D печать на email с генерацией номера заказа
Args: event - dict with httpMethod, body (JSON с данными формы)
      context - object with attributes: request_id, function_name
Returns: HTTP response с номером заказа
'''

import json
import smtplib
import os
import base64
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
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
        
        {'<h3>Файл модели:</h3><p>✅ Файл прикреплен: <strong>' + body_data.get('fileName', '') + '</strong></p>' if body_data.get('fileName') else '<p>❌ Файл не прикреплен</p>'}
        
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
    
    msg_company = MIMEMultipart()
    msg_company['Subject'] = f'Новый заказ на 3D печать №{order_number}'
    msg_company['From'] = smtp_user
    msg_company['To'] = 'zakaz@3dprintcustoms.ru'
    msg_company.attach(MIMEText(email_body, 'html', 'utf-8'))
    
    file_base64 = body_data.get('fileBase64', '')
    file_name = body_data.get('fileName', '')
    
    if file_base64 and file_name:
        file_data = base64.b64decode(file_base64)
        
        part = MIMEBase('application', 'octet-stream')
        part.set_payload(file_data)
        encoders.encode_base64(part)
        part.add_header('Content-Disposition', f'attachment; filename={file_name}')
        msg_company.attach(part)
    
    client_email_body = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #2563eb;">Спасибо за ваш заказ!</h2>
        <p>Ваша заявка успешно принята.</p>
        
        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Номер заказа: <span style="color: #2563eb;">{order_number}</span></h3>
        </div>
        
        <h3>Параметры вашего заказа:</h3>
        <ul>
            <li><strong>Размеры:</strong> {body_data.get('length')} x {body_data.get('width')} x {body_data.get('height')} мм</li>
            <li><strong>Материал:</strong> {body_data.get('plastic')}</li>
            <li><strong>Цвет:</strong> {body_data.get('color')}</li>
            <li><strong>Заполнение:</strong> {body_data.get('infill')}%</li>
            <li><strong>Количество:</strong> {body_data.get('quantity')} шт</li>
        </ul>
        
        {'<h3>Описание:</h3><p>' + body_data.get('description', '') + '</p>' if body_data.get('description') else ''}
        
        <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Мы свяжемся с вами в течение 24 часов</strong> для уточнения деталей и расчета стоимости.</p>
        </div>
        
        <hr style="margin: 30px 0;">
        
        <p style="color: #666;">С уважением,<br>Команда 3D Print Customs</p>
        <p style="color: #666; font-size: 14px;">
            📧 info@3dprintcustoms.ru<br>
            📍 г. Москва, ул. Лобановский Лес, дом 11 (м. Прокшино)
        </p>
        
        <p style="color: #999; font-size: 12px; margin-top: 30px;">Дата заказа: {datetime.now().strftime('%d.%m.%Y %H:%M')}</p>
    </body>
    </html>
    """
    
    msg_client = MIMEMultipart('alternative')
    msg_client['Subject'] = f'Ваш заказ на 3D печать №{order_number}'
    msg_client['From'] = smtp_user
    msg_client['To'] = body_data.get('email')
    msg_client.attach(MIMEText(client_email_body, 'html', 'utf-8'))
    
    try:
        with smtplib.SMTP_SSL(smtp_server, smtp_port) as server:
            server.login(smtp_user, smtp_password)
            server.send_message(msg_company)
            server.send_message(msg_client)
    except (smtplib.SMTPException, OSError) as e:
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