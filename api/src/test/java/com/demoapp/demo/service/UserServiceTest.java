package com.demoapp.demo.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

 //Testes UNITÁRIOS para UserService.
 
public class UserServiceTest {

    private UserService userService;

    @BeforeEach
    void setUp() {
        // UserService não depende de nada além do repositório para esses métodos,
        // e isEmailValid / isPasswordValid não usam o repositório — podemos passar null.
        userService = new UserService(null);
    }

    // TESTES DE SUCESSO (devem PASSAR)

    @Test
    @DisplayName("[SUCESSO] isPasswordValid deve retornar true para senha forte")
    void testIsPasswordValid_senhaForte() {
        // Senha que atende todos os critérios: 8+ chars, maiúscula, minúscula, número, especial
        boolean resultado = userService.isPasswordValid("Senha@123");
        assertTrue(resultado, "Uma senha forte deve ser considerada válida");
    }

    @Test
    @DisplayName("[SUCESSO] isPasswordValid deve retornar false para senha sem caractere especial")
    void testIsPasswordValid_semCaractereEspecial() {
        boolean resultado = userService.isPasswordValid("Senha123");
        assertFalse(resultado, "Senha sem caractere especial deve ser inválida");
    }

    // TESTE DE BUG (deve FALHAR — provando o bug)

    /**
     * BUG: isEmailValid() aceita strings como "abc@" ou "@dominio" porque
     * verifica apenas a presença de "@". Um e-mail válido precisa ter
     * conteúdo antes e depois do "@", além de um domínio com ponto.
     *
     * Este teste FALHA, demonstrando o bug.
     */
    @Test
    @DisplayName("[BUG] isEmailValid não deve aceitar e-mail sem domínio (ex: 'abc@')")
    void testIsEmailValid_semDominio_deveFalhar() {
        boolean resultado = userService.isEmailValid("abc@");
        assertFalse(resultado, "E-mail 'abc@' é inválido e não deveria ser aceito");
    }
}