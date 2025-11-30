(function(){
  const ADMIN_USERNAME = 'E2Wrepresentações@gmail.com.br';
  const PASSWORD_KEY = 'adminPassword';
  const SESSION_KEY = 'adminSession';
  const OTP_KEY = 'adminOtp';

  function getPassword(){
    return localStorage.getItem(PASSWORD_KEY) || 'Will@0906'; // padrão: senha fornecida
  }

  function setPassword(pwd){
    localStorage.setItem(PASSWORD_KEY, pwd);
  }

  function login(username, password){
    if (username !== ADMIN_USERNAME) return false;
    const ok = password === getPassword();
    if (ok){
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        username: ADMIN_USERNAME,
        loginTime: new Date().toISOString(),
        token: btoa(ADMIN_USERNAME + ':' + Date.now())
      }));
    }
    return ok;
  }

  function isLogged(){
    try{
      const s = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
      return !!(s && s.username === ADMIN_USERNAME && s.token);
    }catch(e){ return false; }
  }

  function logout(){
    localStorage.removeItem(SESSION_KEY);
  }

  function setOtp(code, email, ttlMinutes){
    const ttl = typeof ttlMinutes === 'number' ? ttlMinutes : 10;
    const now = Date.now();
    const data = {
      code: (code || '').toString(),
      email: (email || '').toString(),
      createdAt: new Date(now).toISOString(),
      expiresAt: new Date(now + ttl*60*1000).toISOString()
    };
    localStorage.setItem(OTP_KEY, JSON.stringify(data));
    return data;
  }

  function getOtp(){
    try{ return JSON.parse(localStorage.getItem(OTP_KEY) || 'null'); }catch(e){ return null; }
  }

  function verifyOtp(code){
    const otp = getOtp();
    if (!otp || !otp.code) return false;
    const now = Date.now();
    const exp = Date.parse(otp.expiresAt || 0);
    if (isNaN(exp) || now > exp) return false;
    return (otp.code === (code || '').toString());
  }

  function clearOtp(){ localStorage.removeItem(OTP_KEY); }

  window.AdminAuth = { getPassword, setPassword, login, isLogged, logout, setOtp, getOtp, verifyOtp, clearOtp };
})();
