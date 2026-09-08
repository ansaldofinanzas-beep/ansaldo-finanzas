# Guía de Despliegue: Cristian Ansaldo (Vercel + Supabase) 🚀

Esta guía detalla la arquitectura para implementar el sitio web con una base de datos en **Supabase** (PostgreSQL) y el frontend + funciones serverless en **Vercel**, tal como en el *Proyecto Comunidad Sinth*.

---

## 💡 Recomendación de Flujo de Trabajo

### Opción A (La más recomendada y ordenada):
> **Crear una cuenta de Gmail dedicada (ej: `ansaldo.finanzas@gmail.com`)**

1. Creas esa cuenta de Gmail para el proyecto.
2. Con ese mismo Gmail inicias sesión en **GitHub**, **Vercel** y **Supabase** (usando el botón *"Continue with Google"*).
3. Configuras todo en 10 minutos.
4. Cuando todo esté listo y probado, le entregas a Cristian el usuario y la contraseña del Gmail.
5. Cristian cambia la contraseña, asocia su número de teléfono y **le queda todo su ecosistema digital centralizado y a su nombre**, sin depender de nadie en el futuro.

### Opción B (Si Cristian prefiere no involucrarse en nada técnico):
> **Alojarlo dentro de tus propias cuentas de GitHub / Vercel / Supabase**
- Creas un proyecto llamado `ansaldo-finanzas` dentro de tu cuenta actual.
- Cristian solo recibe los mensajes de WhatsApp y las consultas que se guarden.

---

## 🛠️ Paso 1: Configurar la Base de Datos en Supabase (2 minutos)

1. Ingresa a [supabase.com](https://supabase.com/) e inicia sesión.
2. Haz clic en **New Project** y nómbralo `ansaldo-finanzas`. Asigna una contraseña segura y elige la región (ej: `Sao Paulo` o `East US`).
3. Ve a la barra lateral izquierda al icono **SQL Editor** (ícono de terminal `>_`).
4. Haz clic en **New query**, abre el archivo [`supabase_schema.sql`](supabase_schema.sql), copia todo su contenido, pégalo en el editor y presiona **Run**.
   - *Esto creará automáticamente la tabla `leads` con todos los campos necesarios (nombre, empresa, teléfono, email, motivo, simulación, fecha y estado).*
5. Ve a **Project Settings** (ícono de engranaje abajo a la izquierda) > **API**:
   - Copia la **Project URL** (ej: `https://abcdefghijklm.supabase.co`).
   - Copia la **anon public key**.
   - Copia la **service_role key** (clave secreta para serverless).

---

## 💻 Paso 2: Crear el Repositorio en GitHub y Subir el Código

1. Entra a [github.com](https://github.com/) y crea un repositorio vacío (ej: `ansaldo-finanzas`).
2. Abre una terminal de PowerShell en esta carpeta y ejecuta:
   ```powershell
   git init
   git add .
   git commit -m "feat: web profesional con serverless y supabase para Cristian Ansaldo"
   git branch -M main
   git remote add origin <URL_DE_TU_REPOSITORIO_EN_GITHUB>
   git push -u origin main
   ```

---

## 🚀 Paso 3: Desplegar en Vercel

1. Inicia sesión en [vercel.com](https://vercel.com/) con GitHub.
2. Haz clic en **Add New...** > **Project**.
3. Importa el repositorio `ansaldo-finanzas`.
4. En la sección **Environment Variables**, agrega las siguientes 3 variables:
   - `SUPABASE_URL` = (La URL de tu proyecto en Supabase)
   - `SUPABASE_ANON_KEY` = (La clave anon de Supabase)
   - `SUPABASE_SERVICE_ROLE_KEY` = (La clave service_role de Supabase)
5. Haz clic en **Deploy**.
6. ¡Listo! En menos de 60 segundos tendrás tu sitio funcionando con URL propia (ej: `ansaldo-finanzas.vercel.app`), SSL automático y registro de todos los clientes en la base de datos de Supabase.
