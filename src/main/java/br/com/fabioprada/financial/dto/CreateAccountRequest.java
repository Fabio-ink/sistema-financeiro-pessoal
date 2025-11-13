package br.com.fabioprada.financial.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class CreateAccountRequest {
    private String name;
    private BigDecimal initialBalance;
}
