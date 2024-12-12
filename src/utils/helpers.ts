import axios, { AxiosRequestConfig } from 'axios';
import { AES } from 'crypto-js';
import { config as configData } from '../config/config';

const config = configData[process.env.NODE_ENV || 'development'];

export const getKeyByValue = (object, value) => {
  return Object.keys(object).find((key) => object[key] === value);
};

export const escapeWildcards = (value: string) => {
  if (value) {
    return value.replace('_', '\\_').replace('%', '\\%');
  }
  return value;
};

export async function callWebhook<T>(webhookUrl: string, body: T) {
  const rawResponse = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  console.log('CALL_WEBHOOK_RESPONSE', rawResponse);

  return rawResponse;
}

export async function ConvertTiny(url: string): Promise<string> {
  try {
    const requestConfig: AxiosRequestConfig = {
      url: `https://api.tinyurl.com/create/`,
      method: `post`,
      headers: {
        Authorization: `Bearer ${config.appConfig.tinyurlToken}`,
      },
      data: {
        url: url,
      },
    };
    const response = await axios(requestConfig);
    return response.data.data.tiny_url;
  } catch (error) {
    console.error('An error occurred:', error.message);
    throw error;
  }
}

export async function EncryptData(message: any): Promise<string> {
  const msg = JSON.stringify(message);
  const encryptedData = AES.encrypt(msg, 'gDdoxYdfT5XCJw0y');
  return encodeURIComponent(encryptedData);
}
