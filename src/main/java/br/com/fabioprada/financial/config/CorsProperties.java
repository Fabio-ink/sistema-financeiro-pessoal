package br.com.fabioprada.financial.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import lombok.Data;
import java.util.List;

@Data
@ConfigurationProperties(prefix = "cors")
public class CorsProperties {
    private List<String> allowedOrigins;
}
