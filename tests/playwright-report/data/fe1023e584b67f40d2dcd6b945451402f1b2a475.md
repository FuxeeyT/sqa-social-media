# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\signin-and-like.spec.ts >> Fluxo de Login (Sign In) >> deve fazer login com credenciais válidas e redirecionar para home
- Location: tests\e2e\signin-and-like.spec.ts:9:7

# Error details

```
Error: locator.click: Error: strict mode violation: getByRole('button', { name: 'Entrar' }) resolved to 2 elements:
    1) <button>Entrar</button> aka getByRole('banner').getByRole('button', { name: 'Entrar' })
    2) <button type="submit">Entrar</button> aka getByRole('main').getByRole('button', { name: 'Entrar' })

Call log:
  - waiting for getByRole('button', { name: 'Entrar' })

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e4]:
        - heading "SQA Social Media" [level=1] [ref=e5] [cursor=pointer]
        - generic [ref=e6]:
          - button "Entrar" [ref=e7] [cursor=pointer]
          - button "Criar Conta" [ref=e8] [cursor=pointer]
    - main [ref=e9]:
      - generic [ref=e10]:
        - heading "Entrar" [level=1] [ref=e11]
        - generic [ref=e12]:
          - generic [ref=e13]:
            - generic [ref=e14]: Email
            - textbox "seu@email.com" [ref=e15]: teste@gmail.com
          - generic [ref=e16]:
            - generic [ref=e17]: Senha
            - textbox "••••••••" [active] [ref=e18]: Senha@123
          - button "Entrar" [ref=e19] [cursor=pointer]
        - button "Esqueci minha senha" [ref=e21] [cursor=pointer]
        - generic [ref=e22]:
          - text: Não tem uma conta?
          - button "Criar conta" [ref=e23] [cursor=pointer]
  - button "Open Next.js Dev Tools" [ref=e29] [cursor=pointer]:
    - img [ref=e30]
  - alert [ref=e33]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | const existingUser = {
  4  |   email: "teste@gmail.com",
  5  |   password: "Senha@123",
  6  | };
  7  | 
  8  | test.describe("Fluxo de Login (Sign In)", () => {
  9  |   test("deve fazer login com credenciais válidas e redirecionar para home", async ({
  10 |     page,
  11 |   }) => {
  12 |     await page.goto("/signin");
  13 |     await expect(page.getByRole("heading", { name: "Entrar" })).toBeVisible();
  14 |     await page.getByPlaceholder("seu@email.com").fill(existingUser.email);
  15 |     await page.getByPlaceholder("••••••••").fill(existingUser.password);
> 16 |     await page.getByRole("button", { name: "Entrar" }).click();
     |                                                        ^ Error: locator.click: Error: strict mode violation: getByRole('button', { name: 'Entrar' }) resolved to 2 elements:
  17 |     await expect(page).toHaveURL("http://localhost:3000/");
  18 |     await expect(page.getByText("Sair")).toBeVisible();
  19 |   });
  20 | 
  21 |   test("deve exibir erro ao tentar login com senha incorreta", async ({
  22 |     page,
  23 |   }) => {
  24 |     await page.goto("/signin");
  25 |     await page.getByPlaceholder("seu@email.com").fill(existingUser.email);
  26 |     await page.getByPlaceholder("••••••••").fill("SenhaErrada@999");
  27 |     await page.getByRole("button", { name: "Entrar" }).click();
  28 |     await expect(page.getByText(/credenciais inválidas|verifique suas credenciais/i)).toBeVisible();
  29 |   });
  30 | 
  31 |   test("deve exibir erro ao tentar login com e-mail inexistente", async ({
  32 |     page,
  33 |   }) => {
  34 |     await page.goto("/signin");
  35 |     await page.getByPlaceholder("seu@email.com").fill("naoexiste@naoexiste.com");
  36 |     await page.getByPlaceholder("••••••••").fill(existingUser.password);
  37 |     await page.getByRole("button", { name: "Entrar" }).click();
  38 |     await expect(page.getByText(/credenciais inválidas|verifique suas credenciais/i)).toBeVisible();
  39 |   });
  40 | });
  41 | 
  42 | test.describe("Fluxo de Curtida de Posts", () => {
  43 |   test("deve acessar a home sem login e ver os posts", async ({ page }) => {
  44 |     await page.goto("/");
  45 |     await page.waitForLoadState("networkidle");
  46 |     await expect(page).toHaveURL("http://localhost:3000/");
  47 |     await expect(page.getByText("Sair")).not.toBeVisible();
  48 |   });
  49 | });
```