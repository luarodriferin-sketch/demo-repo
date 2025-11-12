"""
Conecta con un deployment de Foundry/Azure OpenAI usando API Key guardada en variables de entorno.

Instrucciones rápidas:
1. Copia `ai/.env.example` a `ai/.env` y rellena `AZURE_API_KEY` y `AZURE_ENDPOINT`.
2. Instala dependencias: `pip install -r ai/requirements.txt` (Python >= 3.8).
3. Ejecuta: `python ai/api-connect.py`.

El script usa la nueva SDK `openai` (clase OpenAI) y `python-dotenv` para cargar variables de entorno.
"""

import os
import sys
from dotenv import load_dotenv

try:
	from openai import OpenAI
except Exception as e:
	print("No se encuentra la librería 'openai'. Instálala con: pip install openai")
	raise


# Cargar .env desde la carpeta ai/ (si existe)
base_dir = os.path.dirname(__file__)
dotenv_path = os.path.join(base_dir, ".env")
load_dotenv(dotenv_path)

AZURE_ENDPOINT = os.environ.get("AZURE_ENDPOINT")
AZURE_API_KEY = os.environ.get("AZURE_API_KEY")
AZURE_DEPLOYMENT_NAME = os.environ.get("AZURE_DEPLOYMENT_NAME", "Phi-4")

if not AZURE_ENDPOINT or not AZURE_API_KEY:
	print("Por favor configura AZURE_ENDPOINT y AZURE_API_KEY en `ai/.env` o exportalas en el entorno.")
	print("Ejemplo (Unix): export AZURE_API_KEY=xxx; export AZURE_ENDPOINT=https://... ")
	sys.exit(1)


def main():
	# Crear cliente
	client = OpenAI(base_url=AZURE_ENDPOINT, api_key=AZURE_API_KEY)

	# Mensaje de ejemplo
	messages = [
		{"role": "user", "content": "¿cuentame en detalle acerca de la cripto moneda xpr network o tambien conocida como proton?"}
	]

	try:
		completion = client.chat.completions.create(
			model=AZURE_DEPLOYMENT_NAME,
			messages=messages,
		)

		# DEBUG: imprime la respuesta cruda para entender la estructura
		print("Raw completion repr:")
		try:
			# Muchos objetos de la SDK expone __dict__ o convertible
			import json

			def _convert(obj):
				if isinstance(obj, dict):
					return obj
				if hasattr(obj, "to_dict"):
					return obj.to_dict()
				if hasattr(obj, "__dict__"):
					return {k: _convert(v) for k, v in obj.__dict__.items()}
				return str(obj)

			print(json.dumps(_convert(completion), indent=2, ensure_ascii=False))
		except Exception:
			# Fallback
			print(repr(completion))

		# Extraer contenido de forma robusta soportando varias estructuras
		content = None

		choices = None
		if hasattr(completion, "choices"):
			choices = completion.choices
		elif isinstance(completion, dict) and "choices" in completion:
			choices = completion["choices"]

		if choices and len(choices) > 0:
			first = choices[0]

			# posibles ubicaciones del mensaje/respuesta
			# 1) first.message.content (objeto)
			# 2) first["message"]["content"] (dict)
			# 3) first.text (algunos endpoints antiguos)
			# 4) first.get("delta") (streaming)

			msg = None
			# obj-like
			if hasattr(first, "message"):
				msg = first.message
			elif isinstance(first, dict):
				msg = first.get("message") or first.get("delta") or first.get("text")

			# si msg es string
			if isinstance(msg, str):
				content = msg
			elif isinstance(msg, dict):
				# dict con clave content
				content = msg.get("content") or msg.get("text")
			else:
				# objeto con atributo content
				if msg is not None and hasattr(msg, "content"):
					content = msg.content
				elif hasattr(first, "text"):
					content = first.text
				elif isinstance(first, dict):
					content = first.get("text")

		print("Respuesta del modelo:")
		print(content)

	except Exception as err:
		print("Error al llamar al modelo:", err)
		print("Si falla, verifique que AZURE_ENDPOINT apunte al root correcto (p.ej. https://.../openai/v1/)")


if __name__ == "__main__":
	main()

