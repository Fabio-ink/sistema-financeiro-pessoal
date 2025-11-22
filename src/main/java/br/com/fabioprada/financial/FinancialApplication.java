package br.com.fabioprada.financial;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import br.com.fabioprada.financial.config.JwtProperties;
import br.com.fabioprada.financial.config.CorsProperties;

@SpringBootApplication
@EnableConfigurationProperties({ JwtProperties.class, CorsProperties.class })
public class FinancialApplication {

	public static void main(String[] args) {
		SpringApplication.run(FinancialApplication.class, args);
	}

}
