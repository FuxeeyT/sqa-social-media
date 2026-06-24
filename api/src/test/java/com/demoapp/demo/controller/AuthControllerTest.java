package com.demoapp.demo.controller;

import com.demoapp.demo.dto.UserDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // TESTES DE SUCESSO (devem PASSAR)

    @Test
    @DisplayName("[SUCESSO] POST /auth/signup deve retornar 200 com dados válidos")
    void testSignup_dadosValidos_retorna200() throws Exception {
        UserDTO dto = new UserDTO();
        dto.setEmail("usuario@teste.com");
        dto.setPassword("Senha@123");

        mockMvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("usuario@teste.com"));
    }

    @Test
    @DisplayName("[SUCESSO] POST /auth/signin deve retornar 401 para credenciais incorretas")
    void testSignin_credenciaisErradas_retorna401() throws Exception {
        UserDTO dto = new UserDTO();
        dto.setEmail("naoexiste@teste.com");
        dto.setPassword("Senha@123");

        mockMvc.perform(post("/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Credenciais inválidas"));
    }

    // TESTE DE BUG (deve FALHAR — provando o bug)

    /**
     * BUG: Ao tentar cadastrar um e-mail já existente, o sistema retorna
     * a mensagem "E-mail já está em uso", mas o requisito especifica
     * que a mensagem deve ser "E-mail já cadastrado".
     *
     * Este teste FALHA, demonstrando o bug.
     */
    @Test
    @DisplayName("[BUG] POST /auth/signup com e-mail duplicado deve retornar mensagem 'E-mail já cadastrado'")
    void testSignup_emailDuplicado_mensagemCorreta() throws Exception {
        // Cadastra o usuário pela primeira vez
        UserDTO dto = new UserDTO();
        dto.setEmail("duplicado@teste.com");
        dto.setPassword("Senha@123");

        mockMvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());

        // Tenta cadastrar o mesmo e-mail novamente — deve falhar com a mensagem correta
        mockMvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isConflict())
                // O sistema retorna "E-mail já está em uso" — o teste espera "E-mail já cadastrado"
                // → este assert vai FALHAR, provando o bug
                .andExpect(jsonPath("$.message").value("E-mail já cadastrado"));
    }
}