import { test, expect } from "@playwright/test";

const API_URL = "http://localhost:8080";
const uniqueEmail = `api_test_${Date.now()}@example.com`;
const validPassword = "Senha@123";

test.describe("POST /auth/signup", () => {
  test("deve retornar 200 ao cadastrar com sucesso", async ({ request }) => {
    const response = await request.post(`${API_URL}/auth/signup`, {
      data: { email: uniqueEmail, password: validPassword },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty("email", uniqueEmail);
    expect(body).toHaveProperty("id");
  });

  test("deve retornar 409 ao cadastrar e-mail duplicado", async ({ request }) => {
    const response = await request.post(`${API_URL}/auth/signup`, {
      data: { email: uniqueEmail, password: validPassword },
    });
    expect(response.status()).toBe(409);
    const body = await response.json();
    expect(body.message).toMatch(/e-mail já está em uso/i);
  });

  test("deve retornar 422 ao enviar e-mail inválido", async ({ request }) => {
    const response = await request.post(`${API_URL}/auth/signup`, {
      data: { email: "emailinvalido", password: validPassword },
    });
    expect(response.status()).toBe(422);
  });

  test("deve retornar 422 ao enviar senha inválida", async ({ request }) => {
    const response = await request.post(`${API_URL}/auth/signup`, {
      data: { email: "outro@example.com", password: "fraca" },
    });
    expect(response.status()).toBe(422);
  });
});

test.describe("POST /auth/signin", () => {
  test("deve retornar 200 ao fazer login com sucesso", async ({ request }) => {
    const response = await request.post(`${API_URL}/auth/signin`, {
      data: { email: uniqueEmail, password: validPassword },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty("email", uniqueEmail);
  });

  test("deve retornar 401 ao fazer login com senha incorreta", async ({ request }) => {
    const response = await request.post(`${API_URL}/auth/signin`, {
      data: { email: uniqueEmail, password: "SenhaErrada@999" },
    });
    expect(response.status()).toBe(401);
  });

  test("deve retornar 401 ao fazer login com e-mail inexistente", async ({ request }) => {
    const response = await request.post(`${API_URL}/auth/signin`, {
      data: { email: "naoexiste@naoexiste.com", password: validPassword },
    });
    expect(response.status()).toBe(401);
  });

  test("deve retornar 422 ao fazer login com e-mail inválido", async ({ request }) => {
    const response = await request.post(`${API_URL}/auth/signin`, {
      data: { email: "emailinvalido", password: validPassword },
    });
    expect(response.status()).toBe(422);
  });
});

test.describe("POST /auth/reset-password", () => {
  test("deve retornar 200 ao solicitar reset com e-mail existente", async ({ request }) => {
    const response = await request.post(`${API_URL}/auth/reset-password`, {
      data: { email: uniqueEmail },
    });
    expect(response.status()).toBe(200);
  });

  test("deve retornar 404 ao solicitar reset com e-mail inexistente", async ({ request }) => {
    const response = await request.post(`${API_URL}/auth/reset-password`, {
      data: { email: "naoexiste@naoexiste.com" },
    });
    expect(response.status()).toBe(404);
  });

  test("deve retornar 422 ao solicitar reset com e-mail inválido", async ({ request }) => {
    const response = await request.post(`${API_URL}/auth/reset-password`, {
      data: { email: "invalido" },
    });
    expect(response.status()).toBe(422);
  });
});