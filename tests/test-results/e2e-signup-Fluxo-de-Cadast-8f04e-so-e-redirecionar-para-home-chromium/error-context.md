# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\signup.spec.ts >> Fluxo de Cadastro (Sign Up) >> deve cadastrar um novo usuário com sucesso e redirecionar para home
- Location: tests\e2e\signup.spec.ts:7:7

# Error details

```
Error: locator.click: Error: strict mode violation: getByRole('button', { name: 'Criar conta' }) resolved to 2 elements:
    1) <button>Criar Conta</button> aka getByRole('banner').getByRole('button', { name: 'Criar Conta' })
    2) <button type="submit">Criar Conta</button> aka getByRole('main').getByRole('button', { name: 'Criar Conta' })

Call log:
  - waiting for getByRole('button', { name: 'Criar conta' })

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
        - heading "Criar Conta" [level=1] [ref=e11]
        - generic [ref=e12]:
          - generic [ref=e13]:
            - generic [ref=e14]: Email
            - textbox "seu@email.com" [ref=e15]: testuser_1782312098907@example.com
          - generic [ref=e16]:
            - generic [ref=e17]: Senha
            - textbox "••••••••" [ref=e18]: Senha@123
          - generic [ref=e19]:
            - generic [ref=e20]: Confirmar Senha
            - textbox "••••••••" [active] [ref=e21]: Senha@123
          - generic [ref=e22]:
            - text: "A senha deve conter:"
            - list [ref=e23]:
              - listitem [ref=e24]: Mínimo de 8 caracteres
              - listitem [ref=e25]: Pelo menos uma letra maiúscula
              - listitem [ref=e26]: Pelo menos uma letra minúscula
              - listitem [ref=e27]: Pelo menos um número
              - listitem [ref=e28]: Pelo menos um caractere especial
          - button "Criar Conta" [ref=e29] [cursor=pointer]
        - generic [ref=e30]:
          - text: Já tem uma conta?
          - button "Entrar" [ref=e31] [cursor=pointer]
  - button "Open Next.js Dev Tools" [ref=e37] [cursor=pointer]:
    - img [ref=e38]
  - alert [ref=e41]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | const uniqueEmail = `testuser_${Date.now()}@example.com`;
  4  | const validPassword = "Senha@123";
  5  | 
  6  | test.describe("Fluxo de Cadastro (Sign Up)", () => {
  7  |   test("deve cadastrar um novo usuário com sucesso e redirecionar para home", async ({
  8  |     page,
  9  |   }) => {
  10 |     await page.goto("/signup");
  11 |     await expect(page.getByRole("heading", { name: "Criar conta" })).toBeVisible();
  12 |     await page.getByPlaceholder("seu@email.com").fill(uniqueEmail);
  13 |     await page.getByPlaceholder("••••••••").first().fill(validPassword);
  14 |     await page.getByPlaceholder("••••••••").nth(1).fill(validPassword);
> 15 |     await page.getByRole("button", { name: "Criar conta" }).click();
     |                                                             ^ Error: locator.click: Error: strict mode violation: getByRole('button', { name: 'Criar conta' }) resolved to 2 elements:
  16 |     await expect(page).toHaveURL("http://localhost:3000/");
  17 |     await expect(page.getByText("Sair")).toBeVisible();
  18 |   });
  19 | 
  20 |   test("deve exibir erro ao tentar cadastrar com e-mail já existente", async ({
  21 |     page,
  22 |   }) => {
  23 |     await page.goto("/signup");
  24 |     await page.getByPlaceholder("seu@email.com").fill(uniqueEmail);
  25 |     await page.getByPlaceholder("••••••••").first().fill(validPassword);
  26 |     await page.getByPlaceholder("••••••••").nth(1).fill(validPassword);
  27 |     await page.getByRole("button", { name: "Criar conta" }).click();
  28 |     await expect(page.getByText(/e-mail já está em uso/i)).toBeVisible();
  29 |   });
  30 | 
  31 |   test("deve exibir erro de validação ao submeter senha fraca", async ({
  32 |     page,
  33 |   }) => {
  34 |     await page.goto("/signup");
  35 |     await page.getByPlaceholder("seu@email.com").fill("outro@example.com");
  36 |     await page.getByPlaceholder("••••••••").first().fill("senhasimples");
  37 |     await page.getByPlaceholder("••••••••").nth(1).fill("senhasimples");
  38 |     await page.getByRole("button", { name: "Criar conta" }).click();
  39 |     await expect(page.getByText(/senha/i)).toBeVisible();
  40 |   });
  41 | });
```