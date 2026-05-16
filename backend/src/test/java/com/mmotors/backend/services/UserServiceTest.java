package com.mmotors.backend.services;

import com.mmotors.backend.entities.User;
import com.mmotors.backend.entities.UserRole;
import com.mmotors.backend.repositories.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    @DisplayName("Inscription : Succès quand l'email n'existe pas")
    void register_ShouldSaveUser_WhenEmailDoesNotExist() {
        // GIVEN
        User user = User.builder()
                .email("jean@test.com")
                .motDePasse("password123")
                .nom("Dupont")
                .prenom("Jean")
                .role(UserRole.CLIENT)
                .build();

        given(userRepository.findByEmail(user.getEmail())).willReturn(Optional.empty());
        given(passwordEncoder.encode("password123")).willReturn("hashedPassword");
        given(userRepository.save(any(User.class))).willReturn(user);

        // WHEN
        User savedUser = userService.register(user);

        // THEN
        assertThat(savedUser).isNotNull();
        assertThat(user.getMotDePasse()).isEqualTo("hashedPassword");
        verify(userRepository, times(1)).save(user);
    }

    @Test
    @DisplayName("Inscription : Erreur quand l'email existe déjà")
    void register_ShouldThrowException_WhenEmailAlreadyExists() {
        // GIVEN
        User user = User.builder()
                .email("jean@test.com")
                .motDePasse("password123")
                .nom("Dupont")
                .prenom("Jean")
                .role(UserRole.CLIENT)
                .build();

        given(userRepository.findByEmail(user.getEmail())).willReturn(Optional.of(user));

        // WHEN & THEN
        assertThatThrownBy(() -> userService.register(user))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Un utilisateur existe déjà avec cet email.");
        
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Connexion : Succès avec identifiants corrects")
    void login_ShouldReturnUser_WhenCredentialsAreCorrect() {
        // GIVEN
        String email = "jean@test.com";
        String password = "password123";
        
        User user = User.builder()
                .id(1L)
                .email(email)
                .motDePasse("hashedPassword")
                .nom("Dupont")
                .prenom("Jean")
                .role(UserRole.CLIENT)
                .build();
        
        given(userRepository.findByEmail(email)).willReturn(Optional.of(user));
        given(passwordEncoder.matches(password, "hashedPassword")).willReturn(true);

        // WHEN
        User result = userService.login(email, password);

        // THEN
        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo(email);
    }

    @Test
    @DisplayName("Connexion : Erreur si le mot de passe est incorrect")
    void login_ShouldThrowException_WhenPasswordIsIncorrect() {
        // GIVEN
        String email = "jean@test.com";
        String password = "wrongPassword";
        
        User user = User.builder()
                .id(1L)
                .email(email)
                .motDePasse("hashedPassword")
                .nom("Dupont")
                .prenom("Jean")
                .role(UserRole.CLIENT)
                .build();

        given(userRepository.findByEmail(email)).willReturn(Optional.of(user));
        given(passwordEncoder.matches(password, "hashedPassword")).willReturn(false);

        // WHEN & THEN
        assertThatThrownBy(() -> userService.login(email, password))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Email ou mot de passe incorrect.");
    }
}