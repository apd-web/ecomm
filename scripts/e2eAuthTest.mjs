(async () => {
  try {
    const t = Date.now();
    const email = `e2e+${t}@example.com`;
    const pwd = 'Test1234!';
    const base = 'http://localhost:4000/api/v1';

    console.log('Registering', email);
    const regRes = await fetch(`${base}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'E2E User', email, password: pwd }),
    });
    console.log('REG STATUS', regRes.status);
    const regBody = await regRes.json().catch(() => null);
    console.log('REG BODY', JSON.stringify(regBody));
    console.log('REG set-cookie', regRes.headers.get('set-cookie'));

    console.log('Logging in');
    const loginRes = await fetch(`${base}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pwd }),
    });
    console.log('LOGIN STATUS', loginRes.status);
    const loginBody = await loginRes.json().catch(() => null);
    console.log('LOGIN BODY', JSON.stringify(loginBody));
    console.log('LOGIN set-cookie', loginRes.headers.get('set-cookie'));

    const access = loginBody?.data?.accessToken || regBody?.data?.accessToken;
    if (access) {
      const me = await fetch(`${base}/auth/me`, { headers: { Authorization: `Bearer ${access}` } });
      console.log('ME STATUS', me.status);
      console.log('ME BODY', JSON.stringify(await me.json().catch(() => null)));
    } else {
      console.log('No access token returned');
    }
  } catch (e) {
    console.error('ERR', e);
    process.exit(1);
  }
})();
