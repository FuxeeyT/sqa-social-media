import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import { isPasswordValid, getPasswordValidationMessage } from "@/utils/password";
import { saveUser, getUser } from "@/lib/localStorage";
import Header from "@/components/Header";
import PostCard from "@/components/PostCard";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

let mockIsAuthenticated = false;

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    isAuthenticated: mockIsAuthenticated,
    user: mockIsAuthenticated ? { id: 1, email: "user@teste.com" } : null,
    isLoading: false,
    logout: jest.fn(),
    login: jest.fn(),
  }),
}));

// ─── 1. UNITÁRIO - FUNÇÃO: isPasswordValid ────────────────────────────────────

describe("[UNITÁRIO - Função] isPasswordValid", () => {
  test("retorna true para senha forte com 8+ chars, maiúscula, minúscula, número e especial", () => {
    expect(isPasswordValid("Senha@123")).toBe(true);
  });

  test("[BUG] deve aceitar senha com exatamente 8 caracteres (mínimo permitido)", () => {
    expect(isPasswordValid("Abc@1234")).toBe(true);
  });
});

// ─── 2. UNITÁRIO - FUNÇÃO: getPasswordValidationMessage ──────────────────────

describe("[UNITÁRIO - Função] getPasswordValidationMessage", () => {
  test("retorna mensagem quando senha está vazia", () => {
    expect(getPasswordValidationMessage("")).toBe("Senha é obrigatória");
  });

  test("[BUG] saveUser deve persistir e getUser deve recuperar o usuário", () => {
    localStorage.clear();
    const user = { id: 42, email: "teste@email.com" };
    saveUser(user);
    const recovered = getUser();
    expect(recovered).toEqual(user);
  });
});

// ─── 3. UNITÁRIO - COMPONENTE: Header ────────────────────────────────────────

describe("[UNITÁRIO - Componente] Header", () => {
  test("exibe botões Entrar e Criar Conta quando usuário não está autenticado", () => {
    mockIsAuthenticated = false;
    render(<Header />);
    expect(screen.getByText("Entrar")).toBeInTheDocument();
    expect(screen.getByText("Criar Conta")).toBeInTheDocument();
    expect(screen.queryByText("Posts Curtidos")).not.toBeInTheDocument();
  });

  test("exibe botões Posts Curtidos e Sair quando usuário está autenticado", () => {
    mockIsAuthenticated = true;
    render(<Header />);
    expect(screen.getByText("Posts Curtidos")).toBeInTheDocument();
    expect(screen.getByText("Sair")).toBeInTheDocument();
    expect(screen.queryByText("Entrar")).not.toBeInTheDocument();
  });
});

// ─── 4. UNITÁRIO - COMPONENTE: PostCard ──────────────────────────────────────

describe("[UNITÁRIO - Componente] PostCard", () => {
  const mockPost = { id: 1, title: "Título do Post", body: "Corpo do post.", liked: false };

  test("renderiza título, corpo e botão Curtir corretamente", () => {
    render(<PostCard post={mockPost} isAuthenticated={false} onLike={jest.fn()} />);
    expect(screen.getByText("Título do Post")).toBeInTheDocument();
    expect(screen.getByText("Corpo do post.")).toBeInTheDocument();
    expect(screen.getByText("Curtir")).toBeInTheDocument();
  });

  test("exibe alert ao clicar em Curtir sem estar autenticado", () => {
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
    render(<PostCard post={mockPost} isAuthenticated={false} onLike={jest.fn()} />);
    fireEvent.click(screen.getByText("Curtir"));
    expect(alertMock).toHaveBeenCalledWith("Você precisa estar autenticado para curtir posts!");
    alertMock.mockRestore();
  });
});

// ─── 5. INTEGRAÇÃO: Header título clicável ───────────────────────────────────

describe("[INTEGRAÇÃO] Header — título SQA Social Media", () => {
  test("exibe o título SQA Social Media e ao clicar redireciona para /", () => {
    mockIsAuthenticated = false;
    mockPush.mockClear();
    render(<Header />);
    const titulo = screen.getByText("SQA Social Media");
    expect(titulo).toBeInTheDocument();
    fireEvent.click(titulo);
    expect(mockPush).toHaveBeenCalledWith("/");
  });
});

// ─── 6. INTEGRAÇÃO: PostCard curtir logado ───────────────────────────────────

describe("[INTEGRAÇÃO] PostCard — curtir post como usuário logado", () => {
  test("botão muda para Curtido após clicar em Curtir sendo autenticado", async () => {
    const onLikeMock = jest.fn().mockResolvedValue(undefined);
    const post = { id: 10, title: "Post Teste", body: "Conteúdo.", liked: false };
    render(<PostCard post={post} isAuthenticated={true} onLike={onLikeMock} />);
    fireEvent.click(screen.getByText("Curtir"));
    await waitFor(() => {
      expect(screen.getByText("Curtido")).toBeInTheDocument();
    });
    expect(onLikeMock).toHaveBeenCalledWith(10);
  });
});