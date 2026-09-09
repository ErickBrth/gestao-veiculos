INSERT INTO dealer (corporate_name, cnpj, zip_code, street, number, neighborhood, city, state) VALUES
  ('Concessionária Norte LTDA', '12345678000195', '58400000', 'Rua Epitácio Pessoa',    '120', 'Centro',           'Campina Grande', 'PB'),
  ('Auto Sul Comércio LTDA',    '98765432000110', '90010000', 'Av. Borges de Medeiros', '450', 'Centro Histórico', 'Porto Alegre',   'RS'),
  ('Veículos Leste S.A.',       '11222333000181', '20040020', 'Av. Rio Branco',         '1',   'Centro',           'Rio de Janeiro', 'RJ');

INSERT INTO vehicle (brand, model, fuel_type, color, manufacture_year, chassis, price, dealer_id) VALUES
  ('Volkswagen', 'Polo',    'FLEX',     'Branco',   2024, '9BWZZZ377VT004251', 92500.00,  1),
  ('Fiat',       'Argo',    'FLEX',     'Vermelho', 2023, '9BD19712MP1234567', 78900.00,  1),
  ('Toyota',     'Corolla', 'HIBRIDO',  'Prata',    2025, 'JTDBR32E60W123456', 178000.00, 2),
  ('Chevrolet',  'Onix',    'FLEX',     'Preto',    2024, '9BGKS48R0PG100001', 89900.00,  2),
  ('Renault',    'Kwid',    'GASOLINA', 'Azul',     2023, '93YRBB004PJ100002', 74500.00,  3),
  ('BYD',        'Dolphin', 'ELETRICO', 'Branco',   2025, 'LC0CE4CB5P0100003', 149900.00, 3),
  ('Ford',       'Ranger',  'DIESEL',   'Cinza',    2024, '8AFAR23L7RJ100004', 289900.00, NULL),
  ('Honda',      'City',    'FLEX',     'Prata',    2024, '93HGM6670RZ100005', 132000.00, NULL);
