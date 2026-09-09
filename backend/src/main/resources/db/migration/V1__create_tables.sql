CREATE TABLE dealer (
    id             BIGSERIAL PRIMARY KEY,
    corporate_name VARCHAR(150) NOT NULL,
    cnpj           VARCHAR(14)  NOT NULL,
    zip_code       VARCHAR(8),
    street         VARCHAR(150),
    number         VARCHAR(20),
    complement     VARCHAR(100),
    neighborhood   VARCHAR(100),
    city           VARCHAR(100),
    state          VARCHAR(2),
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uk_dealer_cnpj UNIQUE (cnpj)
);

CREATE TABLE vehicle (
    id               BIGSERIAL PRIMARY KEY,
    brand            VARCHAR(80)  NOT NULL,
    model            VARCHAR(80)  NOT NULL,
    fuel_type        VARCHAR(20)  NOT NULL,
    color            VARCHAR(40)  NOT NULL,
    manufacture_year SMALLINT,
    chassis          VARCHAR(17),
    price            NUMERIC(12,2),
    external_color   VARCHAR(40),
    dealer_id        BIGINT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uk_vehicle_chassis UNIQUE (chassis),
    CONSTRAINT fk_vehicle_dealer  FOREIGN KEY (dealer_id)
        REFERENCES dealer (id) ON DELETE SET NULL
);

CREATE INDEX idx_vehicle_dealer      ON vehicle (dealer_id);
CREATE INDEX idx_vehicle_brand_model ON vehicle (brand, model);
