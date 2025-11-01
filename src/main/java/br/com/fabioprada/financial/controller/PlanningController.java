package br.com.fabioprada.financial.controller;

import br.com.fabioprada.financial.model.Planning;
import br.com.fabioprada.financial.repository.PlanningRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/planning")
@CrossOrigin(origins = "http://localhost:5173")
public class PlanningController {

    @Autowired
    private PlanningRepository planningRepository;

    @GetMapping
    public List<Planning> getAllPlanning() {
        return planningRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Planning> getPlanningById(@PathVariable Long id) {
        Optional<Planning> planning = planningRepository.findById(id);
        return planning.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Planning createPlanning(@RequestBody Planning planning) {
        return planningRepository.save(planning);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Planning> updatePlanning(@PathVariable Long id, @RequestBody Planning planningDetails) {
        return planningRepository.findById(id)
                .map(planning -> {
                    planning.setMonth(planningDetails.getMonth());
                    planning.setYear(planningDetails.getYear());
                    planning.setCategory(planningDetails.getCategory());
                    planning.setEstimatedAmount(planningDetails.getEstimatedAmount());
                    Planning updatedPlanning = planningRepository.save(planning);
                    return ResponseEntity.ok(updatedPlanning);
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePlanning(@PathVariable Long id) {
        return planningRepository.findById(id)
                .map(planning -> {
                    planningRepository.delete(planning);
                    return ResponseEntity.ok().build();
                }).orElse(ResponseEntity.notFound().build());
    }
}