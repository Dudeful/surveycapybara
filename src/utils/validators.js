const pg = require('pg');
const { Client } = pg;

const pool = (data) => {
  const regex = /^[a-zA-Z\s\d*]{5,30}$/;

  if (!regex.test(data.name)) {
    throw new Error('invalid pool name');
  }

  return data;
};

const email = (email) => {
  const regex = /^\w+([\.-]?\w+)+@\w+([\.:]?\w+)+(\.[a-zA-Z0-9]{2,4})+$/;

  if (!regex.test(email)) {
    throw new Error('the email provided is not valid!');
  }

  return email;
};

const password = (password) => {
  const regex = /(?=^.{8,40}$)(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z0-9]).*/;

  if (!regex.test(password)) {
    throw new Error('the password provided is not valid!');
  }

  return password;
};

const username = (username) => {
  const regex = /^[a-zA-Z\xC0-\uFFFF]{3,20}$/;

  if (!regex.test(username)) {
    throw new Error('the username provided is not valid!');
  }

  return username;
};

const token = async (token) => {
  const client = new Client();
  await client.connect();

  try {
    const selectToken = `
      SELECT * FROM public.users
      WHERE token=$1
    `;

    const tokenResults = await client.query(selectToken, [token]);

    if (!tokenResults.rows[0]) {
      throw new Error('user unauthenticated');
    } else {
      return tokenResults.rows[0];
    }
  } catch (error) {
    await client.query('ROLLBACK');
    return { error };
  } finally {
    await client.end();
  }
};

module.exports = { email, password, username, pool, token };
