package br.com.fabioprada.financial.controller;

import br.com.fabioprada.financial.service.CategoryService;
import br.com.fabioprada.financial.model.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public List<Category> listAll() {
        return categoryService.findAll();
    }

    @PostMapping
    public Category create(@RequestBody Category category) {
        return categoryService.save(category);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> updated(@PathVariable Long id, @RequestBody Category categoryDetails) {
        return categoryService.findById(id)
                .map(category -> {
                    category.setName(categoryDetails.getName());
                    Category updated = categoryService.save(category);
                    return ResponseEntity.ok(updated);
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleter(@PathVariable Long id) {
        return categoryService.findById(id)
                .map(category -> {
                    categoryService.deleteById(id);
                    return ResponseEntity.ok().build();
                }).orElse(ResponseEntity.notFound().build());
    }
}