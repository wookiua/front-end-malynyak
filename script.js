// Отримуємо посилання на елементи DOM
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const messageContainer = document.getElementById('message-container');
const loginBtn = document.getElementById('login-btn');
const citySelect = document.getElementById('city');





usernameInput.addEventListener('blur', function(){

    if (this.value.length > 0 && this.value.length < 4){
        messageContainer.style.color = '#e74c3c';
        messageContainer.textContent = 'Warning: Username is too short (min 4 chars).';
    }else{
        messageContainer.textContent = '';
    }
});

//bonus punkt click function
const credentials ={
    kharkiv: {user: 'admin', pass: 'kharkiv123'},
    dnipro: {user: 'admin', pass: 'dnipro123'},
    kyiv: {user: 'admin', pass: 'kyiv123'}
};


function handleKharkivLogin(){
    authenticate('kharkiv', 'Welcome to Kharkiv System!');
}

function handleDniproLogin(){
    authenticate('dnipro', 'Welcome to Dnipro System!');
}

function handleKyivLogin(){
    authenticate('kyiv', 'Welcome to Kyiv System!');
}

function authenticate(cityKey, successMsg){
    const user = usernameInput.value;
    const pass = passwordInput.value;
    
    if (user === credentials[cityKey].user && pass === credentials[cityKey].pass){
        messageContainer.style.color = 'green';
        messageContainer.textContent = successMsg;
    }else{
        messageContainer.style.color = 'red';
        messageContainer.textContent = `Invalid credentials for ${cityKey} database.`;
    }
}

const loginHandlers ={
    'kharkiv': handleKharkivLogin,
    'dnipro': handleDniproLogin,
    'kyiv': handleKyivLogin
};

let currentCity = citySelect.value;
let currentHandler = loginHandlers[currentCity];
loginBtn.addEventListener('click', currentHandler);

citySelect.addEventListener('change', function(){

    loginBtn.removeEventListener('click', currentHandler);
    
    currentCity = this.value;
    currentHandler = loginHandlers[currentCity];
    
    loginBtn.addEventListener('click', currentHandler);
    
    messageContainer.textContent = '';
});