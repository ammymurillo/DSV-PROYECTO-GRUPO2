// Mostrar/ocultar formularios
function toggleRegister() {
  document.getElementById("login").classList.add("hidden");
  document.getElementById("register").classList.remove("hidden");
  document.getElementById("password-recovery").classList.add("hidden");
}

function toggleLogin() {
  document.getElementById("register").classList.add("hidden");
  document.getElementById("login").classList.remove("hidden");
  document.getElementById("password-recovery").classList.add("hidden");
}

function showPasswordRecovery() {
  document.getElementById("login").classList.add("hidden");
  document.getElementById("register").classList.add("hidden");
  document.getElementById("password-recovery").classList.remove("hidden");
}

// Función para mostrar notificaciones
function showNotification(message, type = 'error') {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.className = `notification ${type} show`;
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 5000);
}

// Validaciones
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validateName(name) {
  const re = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  return re.test(name);
}

function updatePasswordStrength() {
  const password = document.getElementById('regPass').value;
  const strengthBar = document.querySelector('.strength-bar');
  const strengthText = document.querySelector('.strength-text');
  
  if (!strengthBar || !strengthText) return;
  
  if (!password) {
    strengthBar.style.width = '0%';
    strengthBar.style.backgroundColor = '#e0e0e0';
    strengthText.textContent = '';
    return;
  }
  
  let strength = 0;
  let feedback = '';
  
  // Longitud
  if (password.length >= 8) strength += 25;
  
  // Caracteres variados
  if (/[a-z]/.test(password)) strength += 25;
  if (/[A-Z]/.test(password)) strength += 25;
  if (/[0-9]/.test(password)) strength += 25;
  
  // Actualizar barra y texto
  strengthBar.style.width = `${strength}%`;
  
  if (strength <= 25) {
    strengthBar.style.backgroundColor = '#e22134';
    feedback = 'Débil';
  } else if (strength <= 50) {
    strengthBar.style.backgroundColor = '#ff9800';
    feedback = 'Regular';
  } else if (strength <= 75) {
    strengthBar.style.backgroundColor = '#ffc107';
    feedback = 'Buena';
  } else {
    strengthBar.style.backgroundColor = '#1DB954';
    feedback = 'Fuerte';
  }
  
  strengthText.textContent = feedback;
}

// Auto-generar usuario desde nombre
document.addEventListener('DOMContentLoaded', function() {
  const regName = document.getElementById('regName');
  const regUser = document.getElementById('regUser');
  
  if (regName && regUser) {
    regName.addEventListener('blur', function() {
      if (!regUser.value && this.value.trim()) {
        const nombre = this.value.trim();
        const usuario = nombre
          .toLowerCase()
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]/g, '_')
          .replace(/_+/g, '_')
          .replace(/^_|_$/g, '')
          .substring(0, 20);
        
        regUser.value = usuario;
      }
    });
  }

  // Actualizar fuerza de contraseña en tiempo real
  const regPass = document.getElementById('regPass');
  if (regPass) {
    regPass.addEventListener('input', updatePasswordStrength);
  }

  // Validar nombre en tiempo real
  if (regName) {
    regName.addEventListener('input', function() {
      if (this.value && !validateName(this.value)) {
        this.style.borderColor = '#e22134';
        showNotification('El nombre solo puede contener letras y espacios', 'error');
      } else {
        this.style.borderColor = '';
      }
    });
  }
});

// Funciones principales con mejor manejo de errores

async function login() {
  const name = document.getElementById("loginName").value;
  const pass = document.getElementById("loginPass").value;
  const remember = document.getElementById("remember").checked;

  if (!name || !pass) {
    showNotification("Completa todos los campos.");
    return;
  }

  try {
    const formData = new FormData();
    formData.append('action', 'login');
    formData.append('usuario', name);
    formData.append('contrasena', pass);
    formData.append('recordarUsuario', remember);

    console.log('📤 Enviando login...');

    const response = await fetch('php/login.php', {
      method: 'POST',
      body: formData
    });

    console.log('📥 Status:', response.status, 'OK:', response.ok);

    const responseText = await response.text();
    console.log('📄 Respuesta completa:', responseText);

    let result;
    try {
      result = JSON.parse(responseText);
      console.log('✅ JSON parseado correctamente:', result);
    } catch (parseError) {
      console.error('❌ Error parseando JSON:', parseError);
      console.error('📄 Texto que causó el error:', responseText);
      
      if (responseText.includes('Fatal error') || responseText.includes('Parse error')) {
        throw new Error('Error de sintaxis en el servidor PHP');
      } else if (responseText.includes('404') || responseText.includes('Not Found')) {
        throw new Error('Archivo PHP no encontrado');
      } else {
        throw new Error('El servidor devolvió una respuesta inválida');
      }
    }

    if (result.success) {
      showNotification(result.message, 'success');
      
      // Guardar información de sesión
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('userName', name);
      sessionStorage.setItem('userRole', result.rol);
      
      setTimeout(() => {
        if (result.rol === 'admin') {
          window.location.href = "index-admin.html";
        } else {
          window.location.href = "index-user.html";
        }
      }, 1500);
    } else {
      showNotification(result.message);
    }
  } catch (error) {
    console.error('💥 Error completo:', error);
    showNotification("Error: " + error.message);
  }
}

async function register() {
  const name = document.getElementById("regName").value;
  const user = document.getElementById("regUser").value;
  const email = document.getElementById("regEmail").value;
  const pass = document.getElementById("regPass").value;

  if (!name || !user || !email || !pass) {
    showNotification("Completa todos los campos.");
    return;
  }

  try {
    const formData = new FormData();
    formData.append('action', 'registro');
    formData.append('nombre', name);
    formData.append('usuario', user);
    formData.append('email', email);
    formData.append('password', pass);

    console.log('📤 Enviando registro...');

    const response = await fetch('php/login.php', {
      method: 'POST',
      body: formData
    });

    console.log('📥 Status:', response.status, 'OK:', response.ok);

    const responseText = await response.text();
    console.log('📄 Respuesta completa:', responseText);

    let result;
    try {
      result = JSON.parse(responseText);
      console.log('✅ JSON parseado correctamente:', result);
    } catch (parseError) {
      console.error('❌ Error parseando JSON:', parseError);
      console.error('📄 Texto que causó el error:', responseText);
      
      if (responseText.includes('Fatal error') || responseText.includes('Parse error')) {
        throw new Error('Error de sintaxis en el servidor PHP');
      } else if (responseText.includes('404') || responseText.includes('Not Found')) {
        throw new Error('Archivo PHP no encontrado');
      } else {
        throw new Error('El servidor devolvió una respuesta inválida');
      }
    }

    if (result.success) {
      showNotification(result.message, 'success');
      setTimeout(() => {
        toggleLogin();
      }, 2000);
    } else {
      showNotification(result.message);
    }
  } catch (error) {
    console.error('💥 Error completo:', error);
    showNotification("Error: " + error.message);
  }
}

async function recoverPassword() {
  const email = document.getElementById("recoveryEmail").value;

  if (!email) {
    showNotification("Ingresa tu correo electrónico");
    return;
  }

  try {
    const formData = new FormData();
    formData.append('action', 'password-recovery');
    formData.append('email', email);

    console.log('📤 Enviando recuperación...');

    const response = await fetch('php/login.php', {
      method: 'POST',
      body: formData
    });

    console.log('📥 Status:', response.status, 'OK:', response.ok);

    const responseText = await response.text();
    console.log('📄 Respuesta completa:', responseText);

    let result;
    try {
      result = JSON.parse(responseText);
      console.log('✅ JSON parseado correctamente:', result);
    } catch (parseError) {
      console.error('❌ Error parseando JSON:', parseError);
      console.error('📄 Texto que causó el error:', responseText);
      
      if (responseText.includes('Fatal error') || responseText.includes('Parse error')) {
        throw new Error('Error de sintaxis en el servidor PHP');
      } else if (responseText.includes('404') || responseText.includes('Not Found')) {
        throw new Error('Archivo PHP no encontrado');
      } else {
        throw new Error('El servidor devolvió una respuesta inválida');
      }
    }

    if (result.success) {
      showNotification(result.message, 'success');
      setTimeout(() => {
        toggleLogin();
      }, 3000);
    } else {
      showNotification(result.message);
    }
  } catch (error) {
    console.error('💥 Error completo:', error);
    showNotification("Error: " + error.message);
  }
}