package br.com.fabioprada.financial.service;

import br.com.fabioprada.financial.model.Category;
import br.com.fabioprada.financial.model.User;
import br.com.fabioprada.financial.repository.CategoryRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> findAll() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User) {
            User user = (User) principal;
            Long userId = user.getId();
            if (userId != null) {
                return categoryRepository.findAllByUserId(Objects.requireNonNull(userId));
            }
        }
        return Collections.emptyList();
    }

    public Optional<Category> findById(Long id) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User) {
            User user = (User) principal;
            Long userId = user.getId();
            if (userId != null) {
                return categoryRepository.findByIdAndUserId(id, Objects.requireNonNull(userId));
            }
        }
        return Optional.empty();
    }

    public Category save(Category category) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User) {
            User user = (User) principal;
            category.setUser(user);
            return categoryRepository.save(category);
        }
        throw new IllegalStateException("User not authenticated, cannot save category.");
    }

    public void deleteById(Long id) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User) {
            User user = (User) principal;
            Long userId = user.getId();
            if (userId != null) {
                categoryRepository.findByIdAndUserId(id, Objects.requireNonNull(userId)).ifPresent(categoryRepository::delete);
            }
        }
    }
}
