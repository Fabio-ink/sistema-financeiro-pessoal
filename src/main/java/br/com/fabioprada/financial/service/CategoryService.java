package br.com.fabioprada.financial.service;

import br.com.fabioprada.financial.model.Category;
import br.com.fabioprada.financial.model.User;
import br.com.fabioprada.financial.repository.CategoryRepository;
import br.com.fabioprada.financial.security.UserContextService;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@SuppressWarnings("null")
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserContextService userContextService;

    public CategoryService(CategoryRepository categoryRepository, UserContextService userContextService) {
        this.categoryRepository = categoryRepository;
        this.userContextService = userContextService;
    }

    public List<Category> findAll() {
        return userContextService.getCurrentUser()
                .map(user -> categoryRepository.findAllByUserId(user.getId()))
                .orElse(Collections.emptyList());
    }

    public Optional<Category> findById(Long id) {
        return userContextService.getCurrentUser()
                .flatMap(user -> categoryRepository.findByIdAndUserId(id, user.getId()));
    }

    public Category save(Category category) {
        User user = userContextService.getCurrentUserOrThrow();
        category.setUser(user);
        return categoryRepository.save(category);
    }

    public void deleteById(Long id) {
        userContextService.getCurrentUser().ifPresent(user -> categoryRepository.findByIdAndUserId(id, user.getId())
                .ifPresent(categoryRepository::delete));
    }

    public void deleteMultiple(List<Long> ids) {
        userContextService.getCurrentUser().ifPresent(user -> {
            Long userId = user.getId();
            for (Long id : ids) {
                categoryRepository.findByIdAndUserId(id, userId)
                        .ifPresent(categoryRepository::delete);
            }
        });
    }
}
