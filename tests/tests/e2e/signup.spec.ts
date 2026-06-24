import { test, expect } from "@playwright/test";

const uniqueEmail = `testuser_${Date.now()}@example.com`;
const validPassword = "Senha@123";

test.describe("Fluxo de Cadastro (Sign Up)", () => {
  test("deve cadastrar um novo usuário com sucesso e redirecionar para home", async ({
    page,
  }) => {
    await page.goto("/signup");
    await expect(page.getByRole("heading", { name: "Criar conta" })).toBeVisible();
    await page.getByPlaceholder("seu@email.com").fill(uniqueEmail);
    await page.getByPlaceholder("••••••••").first().fill(validPassword);
    await page.getByPlaceholder("••••••••").nth(1).fill(validPassword);
    await page.getByRole("button", { name: "Criar conta" }).click();
    await expect(page).toHaveURL("http://localhost:3000/");
    await expect(page.getByText("Sair")).toBeVisible();
  });

  test("deve exibir erro ao tentar cadastrar com e-mail já existente", async ({
    page,
  }) => {
    await page.goto("/signup");
    await page.getByPlaceholder("seu@email.com").fill(uniqueEmail);
    await page.getByPlaceholder("••••••••").first().fill(validPassword);
    await page.getByPlaceholder("••••••••").nth(1).fill(validPassword);
    await page.getByRole("button", { name: "Criar conta" }).click();
    await expect(page.getByText(/e-mail já está em uso/i)).toBeVisible();
  });

  test("deve exibir erro de validação ao submeter senha fraca", async ({
    page,
  }) => {
    await page.goto("/signup");
    await page.getByPlaceholder("seu@email.com").fill("outro@example.com");
    await page.getByPlaceholder("••••••••").first().fill("senhasimples");
    await page.getByPlaceholder("••••••••").nth(1).fill("senhasimples");
    await page.getByRole("button", { name: "Criar conta" }).click();
    await expect(page.getByText(/senha/i)).toBeVisible();
  });
});