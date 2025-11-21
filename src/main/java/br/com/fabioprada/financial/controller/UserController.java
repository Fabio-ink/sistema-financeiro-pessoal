package br.com.fabioprada.financial.controller;

import br.com.fabioprada.financial.model.User;
import br.com.fabioprada.financial.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final br.com.fabioprada.financial.security.JwtTokenProvider jwtTokenProvider;

    public UserController(UserService userService,
            br.com.fabioprada.financial.security.JwtTokenProvider jwtTokenProvider) {
        this.userService = userService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(@AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> updates) {
        String newName = updates.get("name");
        if (newName == null || newName.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Name cannot be empty");
        }
        User updatedUser = userService.updateUserName(userDetails.getUsername(), newName);

        String newToken = jwtTokenProvider.generateToken(updatedUser);

        Map<String, Object> response = new java.util.HashMap<>();
        response.put("user", updatedUser);
        response.put("token", newToken);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> request) {
        String currentPassword = request.get("currentPassword");
        String newPassword = request.get("newPassword");

        if (currentPassword == null || newPassword == null) {
            return ResponseEntity.badRequest().body("Senha atual e nova senha são obrigatórias");
        }

        try {
            userService.changePassword(userDetails.getUsername(), currentPassword, newPassword);
            return ResponseEntity.ok("Senha alterada com sucesso");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
