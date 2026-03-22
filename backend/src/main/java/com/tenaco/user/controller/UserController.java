package com.tenaco.user.controller;

import com.tenaco.auth.security.UserPrincipal;
import com.tenaco.user.dto.ChangePasswordRequest;
import com.tenaco.user.dto.UpdateProfileRequest;
import com.tenaco.user.dto.UserDto;
import com.tenaco.user.entity.User;
import com.tenaco.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser() {
        User user = UserPrincipal.getCurrentUser();
        return ResponseEntity.ok(UserDto.from(user));
    }

    @PatchMapping("/me")
    public ResponseEntity<UserDto> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateProfile(request));
    }

    @PostMapping("/me/password")
    public ResponseEntity<Map<String, String>> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(request);
        return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
    }
}
