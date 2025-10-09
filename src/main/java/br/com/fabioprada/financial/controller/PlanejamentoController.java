package br.com.fabioprada.financial.controller;

import br.com.fabioprada.financial.model.Planning;
import br.com.fabioprada.financial.repository.PlanningRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/planings")
@CrossOrigin(origins = "http://localhost:5173") // Permite acesso do nosso frontend
public class PlanejamentoController {

    @Autowired
    private PlanningRepository planningRepository;

    @GetMapping
    public List<Planning> listAll() {
        return planningRepository.findAll();
    }

    @PostMapping
    public Planning create(@RequestBody Planning planning) {
        return planningRepository.save(planning);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Planning> updated(@PathVariable Long id, @RequestBody Planning planningDetails) {
        return planningRepository.findById(id)
                .map(planning -> {
                    planning.setYearMonth(planningDetails.getYearMonth());
                    planning.setPlannedValue(planningDetails.getPlannedValue());
                    planning.setCategory(planningDetails.getCategory());
                    Planning updated = planningRepository.save(planning);
                    return ResponseEntity.ok(updated);
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleter(@PathVariable Long id) {
        return planningRepository.findById(id)
                .map(planning -> {
                    planningRepository.delete(planning);
                    return ResponseEntity.ok().build();
                }).orElse(ResponseEntity.notFound().build());
    }
}