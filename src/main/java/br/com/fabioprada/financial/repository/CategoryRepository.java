package br.com.fabioprada.financial.repository;

import br.com.fabioprada.financial.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {}