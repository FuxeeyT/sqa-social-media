import { test, expect } from "@playwright/test";

const existingUser = {
  email: "teste@gmail.com",
  password: "Senha@123",
};

test.describe("Fluxo de Login (Sign In)", () => {
  test("deve fazer login com credenciais válidas e redirecionar para home", async ({
    page,
  }) => {
    await page.goto("/signin");
    await expect(page.getByRole("heading", { name: "Entrar" })).toBeVisible();
    await page.getByPlaceholder("seu@email.com").fill(existingUser.email);
    await page.getByPlaceholder("••••••••").fill(existingUser.password);
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page).toHaveURL("http://localhost:3000/");
    await expect(page.getByText("Sair")).toBeVisible();
  });

  test("deve exibir erro ao tentar login com senha incorreta", async ({
    page,
  }) => {
    await page.goto("/signin");
    await page.getByPlaceholder("seu@email.com").fill(existingUser.email);
    await page.getByPlaceholder("••••••••").fill("SenhaErrada@999");
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page.getByText(/credenciais inválidas|verifique suas credenciais/i)).toBeVisible();
  });

  test("deve exibir erro ao tentar login com e-mail inexistente", async ({
    page,
  }) => {
    await page.goto("/signin");
    await page.getByPlaceholder("seu@email.com").fill("naoexiste@naoexiste.com");
    await page.getByPlaceholder("••••••••").fill(existingUser.password);
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page.getByText(/credenciais inválidas|verifique suas credenciais/i)).toBeVisible();
  });
});

test.describe("Fluxo de Curtida de Posts", () => {
  test("deve acessar a home sem login e ver os posts", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL("http://localhost:3000/");
    await expect(page.getByText("Sair")).not.toBeVisible();
  });
});