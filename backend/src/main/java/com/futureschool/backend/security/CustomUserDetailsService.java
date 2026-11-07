package com.futureschool.backend.security;

import com.futureschool.backend.entity.UserAccount;
import com.futureschool.backend.repository.UserAccountRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserAccountRepository userAccountRepository;

    public CustomUserDetailsService(UserAccountRepository userAccountRepository) {
        this.userAccountRepository = userAccountRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserAccount account = userAccountRepository.findByLoginIdIgnoreCase(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with login ID: " + username));
        return new CustomUserDetails(account);
    }
}
