-- 1. Insertar Usuarios
-- admin@furryfeast.com / admin123Password
INSERT INTO usuarios (id, nombre, cedula, email, password, role)
SELECT 1, 'Administrador Principal', '1000000000', 'admin@furryfeast.com', '$2a$10$73Wik4pJ0xD7OIud88pt2.fF/UdjSuz5XgSZqz4pdbrBrBNvD1Kp6', 'ROLE_ADMIN'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'admin@furryfeast.com');

-- cliente@correo.com / cliente123Password
INSERT INTO usuarios (id, nombre, cedula, email, password, role)
SELECT 2, 'Juan Pérez', '1023456789', 'cliente@correo.com', '$2a$10$VRwbrFFHVSEzjkXzuOA.2eIbp3fO8HTIzQOh3neE6jzoNUgh.GUgy', 'ROLE_CUSTOMER'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'cliente@correo.com');

-- maria@correo.com / maria123Password
INSERT INTO usuarios (id, nombre, cedula, email, password, role)
SELECT 3, 'María Rodríguez', '1098765432', 'maria@correo.com', '$2a$10$.M7l0aQYJb4VQkd4UPBfduQ/qq1N2lijhuHBetuYqWr985dUnQCq2', 'ROLE_CUSTOMER'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'maria@correo.com');


-- 2. Insertar Productos
-- Alimento Premium Perros Adultos 15kg
INSERT INTO productos (id, nombre, descripcion, categoria, precio, stock_actual, stock_minimo, activo, imagen_url)
SELECT 1, 'Alimento Premium Perros Adultos 15kg', 'Nutrición completa y equilibrada para perros adultos de razas medianas y grandes.', 'ALIMENTOS', 45000.0, 12, 5, true, 'https://images.unsplash.com/photo-1589721062230-40a202989b5c?w=500&auto=format&fit=crop&q=60'
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE id = 1);

-- Alimento Gatos Castrados Salmón 3kg
INSERT INTO productos (id, nombre, descripcion, categoria, precio, stock_actual, stock_minimo, activo, imagen_url)
SELECT 2, 'Alimento Gatos Castrados Salmón 3kg', 'Especialmente formulado para el control de peso de gatos castrados.', 'ALIMENTOS', 18500.0, 3, 5, true, 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=500&auto=format&fit=crop&q=60'
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE id = 2);

-- Lantipina Antiparasitario Canino
INSERT INTO productos (id, nombre, descripcion, categoria, precio, stock_actual, stock_minimo, activo, imagen_url)
SELECT 3, 'Lantipina Antiparasitario Canino', 'Tableta masticable para la prevención y tratamiento de pulgas y garrapatas.', 'MEDICAMENTOS', 12000.0, 15, 10, true, 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=500&auto=format&fit=crop&q=60'
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE id = 3);

-- Collar Ajustable Reflectivo Rojo
INSERT INTO productos (id, nombre, descripcion, categoria, precio, stock_actual, stock_minimo, activo, imagen_url)
SELECT 4, 'Collar Ajustable Reflectivo Rojo', 'Collar resistente con costuras reflectivas para paseos nocturnos seguros.', 'ACCESORIOS', 6500.0, 20, 5, true, 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=500&auto=format&fit=crop&q=60'
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE id = 4);

-- Shampoo Hipoalergénico de Avena 500ml
INSERT INTO productos (id, nombre, descripcion, categoria, precio, stock_actual, stock_minimo, activo, imagen_url)
SELECT 5, 'Shampoo Hipoalergénico de Avena 500ml', 'Ideal para mascotas con pieles sensibles, limpia y humecta.', 'CUIDADO', 9800.0, 8, 3, true, 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?w=500&auto=format&fit=crop&q=60'
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE id = 5);

-- Snacks de Hígado Deshidratado 100g
INSERT INTO productos (id, nombre, descripcion, categoria, precio, stock_actual, stock_minimo, activo, imagen_url)
SELECT 6, 'Snacks de Hígado Deshidratado 100g', 'Premios 100% naturales para adiestramiento y deleite de tu mascota.', 'ALIMENTOS', 4200.0, 2, 10, true, 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=500&auto=format&fit=crop&q=60'
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE id = 6);

-- Amoxicilina Suspensión Veterinaria
INSERT INTO productos (id, nombre, descripcion, categoria, precio, stock_actual, stock_minimo, activo, imagen_url)
SELECT 7, 'Amoxicilina Suspensión Veterinaria', 'Antibiótico de amplio espectro para infecciones bacterianas comunes.', 'MEDICAMENTOS', 15500.0, 0, 4, true, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60'
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE id = 7);

-- Arnés Ergonómico de Agarre Rápido
INSERT INTO productos (id, nombre, descripcion, categoria, precio, stock_actual, stock_minimo, activo, imagen_url)
SELECT 8, 'Arnés Ergonómico de Agarre Rápido', 'Arnés antitirones acolchado para mayor confort en caminatas.', 'ACCESORIOS', 22000.0, 6, 4, true, 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&auto=format&fit=crop&q=60'
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE id = 8);

-- Cepillo Cardina Autolimpiable
INSERT INTO productos (id, nombre, descripcion, categoria, precio, stock_actual, stock_minimo, activo, imagen_url)
SELECT 9, 'Cepillo Cardina Autolimpiable', 'Remueve el pelo muerto de perros y gatos con un solo clic.', 'CUIDADO', 7500.0, 14, 5, true, 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=500&auto=format&fit=crop&q=60'
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE id = 9);

-- Alimento Húmedo Perro Lata Pavo 400g
INSERT INTO productos (id, nombre, descripcion, categoria, precio, stock_actual, stock_minimo, activo, imagen_url)
SELECT 10, 'Alimento Húmedo Perro Lata Pavo 400g', 'Delicioso paté rico en proteínas para complementar la dieta diaria.', 'ALIMENTOS', 3100.0, 25, 12, true, 'https://images.unsplash.com/photo-1608454509000-1959d577df0f?w=500&auto=format&fit=crop&q=60'
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE id = 10);

-- Gotas Otológicas Limpiadoras 60ml
INSERT INTO productos (id, nombre, descripcion, categoria, precio, stock_actual, stock_minimo, activo, imagen_url)
SELECT 11, 'Gotas Otológicas Limpiadoras 60ml', 'Solución para prevenir infecciones y disolver el exceso de cerumen.', 'MEDICAMENTOS', 8900.0, 4, 4, true, 'https://images.unsplash.com/photo-1607619056574-7b8f304b3c8a?w=500&auto=format&fit=crop&q=60'
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE id = 11);

-- Rascador de Cartón para Gato Ondulado
INSERT INTO productos (id, nombre, descripcion, categoria, precio, stock_actual, stock_minimo, activo, imagen_url)
SELECT 12, 'Rascador de Cartón para Gato Ondulado', 'Incluye hierba gatera para incentivar el rascado saludable.', 'ACCESORIOS', 5200.0, 1, 3, true, 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=500&auto=format&fit=crop&q=60'
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE id = 12);

-- Pasta Dental Sabor Carne para Perros
INSERT INTO productos (id, nombre, descripcion, categoria, precio, stock_actual, stock_minimo, activo, imagen_url)
SELECT 13, 'Pasta Dental Sabor Carne para Perros', 'Previene la placa, sarro y mal aliento. Apta para uso frecuente.', 'CUIDADO', 6000.0, 9, 3, true, 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&auto=format&fit=crop&q=60'
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE id = 13);

-- Alimento Prescripción Renal Gatos 1.5kg
INSERT INTO productos (id, nombre, descripcion, categoria, precio, stock_actual, stock_minimo, activo, imagen_url)
SELECT 14, 'Alimento Prescripción Renal Gatos 1.5kg', 'Dieta terapéutica para gatos con insuficiencia renal crónica.', 'ALIMENTOS', 24000.0, 5, 5, true, 'https://images.unsplash.com/photo-1569591159212-b02ea8a9f239?w=500&auto=format&fit=crop&q=60'
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE id = 14);

-- Antiinflamatorio Condoprotector Condrovet
INSERT INTO productos (id, nombre, descripcion, categoria, precio, stock_actual, stock_minimo, activo, imagen_url)
SELECT 15, 'Antiinflamatorio Condoprotector Condrovet', 'Suplemento alimentario que protege y regenera las articulaciones.', 'MEDICAMENTOS', 32000.0, 11, 3, true, 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&auto=format&fit=crop&q=60'
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE id = 15);

-- Plato de Acero Inoxidable Antideslizante
INSERT INTO productos (id, nombre, descripcion, categoria, precio, stock_actual, stock_minimo, activo, imagen_url)
SELECT 16, 'Plato de Acero Inoxidable Antideslizante', 'Tazón higiénico de 800ml con base de goma adherente.', 'ACCESORIOS', 4500.0, 30, 10, true, 'https://images.unsplash.com/photo-1591550970193-091f9450c216?w=500&auto=format&fit=crop&q=60'
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE id = 16);

-- Arena Sanitaria Premium para Gatos 4kg
INSERT INTO productos (id, nombre, descripcion, categoria, precio, stock_actual, stock_minimo, activo, imagen_url)
SELECT 17, 'Arena Sanitaria Premium para Gatos 4kg', 'Arena aglomerante de bentonita natural con aroma a lavanda.', 'CUIDADO', 11200.0, 18, 8, true, 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=500&auto=format&fit=crop&q=60'
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE id = 17);

-- Alimento Aves Mezcla Semillas 1kg (activo = false)
INSERT INTO productos (id, nombre, descripcion, categoria, precio, stock_actual, stock_minimo, activo, imagen_url)
SELECT 18, 'Alimento Aves Mezcla Semillas 1kg', 'Alimento balanceado con mijo, alpiste y girasol para aves domésticas.', 'ALIMENTOS', 3800.0, 8, 4, false, null
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE id = 18);

-- Juguete Pelota de Goma Dental
INSERT INTO productos (id, nombre, descripcion, categoria, precio, stock_actual, stock_minimo, activo, imagen_url)
SELECT 19, 'Juguete Pelota de Goma Dental', 'Pelota masticable ultra resistente que limpia los dientes al jugar.', 'ACCESORIOS', 3500.0, 2, 6, true, 'https://images.unsplash.com/photo-1544567822-a6f95c1c045b?w=500&auto=format&fit=crop&q=60'
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE id = 19);

-- Cortauñas Profesional de Acero
INSERT INTO productos (id, nombre, descripcion, categoria, precio, stock_actual, stock_minimo, activo, imagen_url)
SELECT 20, 'Cortauñas Profesional de Acero', 'Alicate con tope de seguridad para evitar cortes profundos en garras.', 'CUIDADO', 5500.0, 12, 5, true, 'https://images.unsplash.com/photo-1581888227599-779811939961?w=500&auto=format&fit=crop&q=60'
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE id = 20);

-- Reiniciar la secuencia para que los nuevos registros no colisionen con los seed
ALTER TABLE productos ALTER COLUMN id RESTART WITH 21;
ALTER TABLE usuarios ALTER COLUMN id RESTART WITH 4;