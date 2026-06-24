import { test, expect } from "@playwright/test";

const API_URL = "http://localhost:8080";
const testUser = {
  email: `posts_test_${Date.now()}@example.com`,
  password: "Senha@123",
};

let userId: number;

test.beforeAll(async ({ request }) => {
  const response = await request.post(`${API_URL}/auth/signup`, {
    data: testUser,
  });
  const body = await response.json();
  userId = body.id;
});

test.describe("GET /posts", () => {
  test("deve retornar 200 ao listar posts sem parâmetros", async ({ request }) => {
    const response = await request.get(`${API_URL}/posts`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toBeDefined();
  });

  test("deve retornar 200 com paginação (limit e skip)", async ({ request }) => {
    const response = await request.get(`${API_URL}/posts?limit=5&skip=0`);
    expect(response.status()).toBe(200);
  });

  test("deve retornar 200 filtrando por userId", async ({ request }) => {
    const response = await request.get(`${API_URL}/posts?userId=${userId}`);
    expect(response.status()).toBe(200);
  });
});

test.describe("GET /posts/liked", () => {
  test("deve retornar 200 ao buscar posts curtidos de um usuário válido", async ({ request }) => {
    const response = await request.get(`${API_URL}/posts/liked?userId=${userId}`);
    expect(response.status()).toBe(200);
  });
});

test.describe("POST /posts/{postId}/like", () => {
  test("deve retornar 200 ao curtir um post com userId válido", async ({ request }) => {
    const response = await request.post(`${API_URL}/posts/1/like?userId=${userId}`);
    expect(response.status()).toBe(200);
  });
});