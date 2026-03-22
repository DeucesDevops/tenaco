package com.tenaco.auth.security;

import com.tenaco.user.entity.User;
import org.springframework.security.core.context.SecurityContextHolder;

public class UserPrincipal {

    public static User getCurrentUser() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof User) {
            return (User) auth.getPrincipal();
        }
        throw new RuntimeException("No authenticated user found");
    }
}
