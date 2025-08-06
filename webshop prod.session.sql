SELECT
  u.cedula,
  u.nombres,
  u.fecha_creacion,
  u.imagen_url,
  COALESCE(
    json_agg(
      json_build_object('nombre', r.nombre)
      ORDER BY r.nombre
    ) FILTER (WHERE r.nombre IS NOT NULL),
    '[]'::json
  ) AS roles
FROM
  wp_usuarios u
LEFT JOIN wp_rol_usuario ru ON u.cedula = ru.usuario_cedula
LEFT JOIN wp_roles r ON ru.rol_id = r.id
GROUP BY u.cedula, u.nombres, u.fecha_creacion, u.imagen_url;

select
  c.id,
  u.nombres,
  c.fecha_compra,
  c.total,
  COALESCE(
    json_agg(
      json_build_object(
        'nombre', p.nombre,
        'precio', p.precio,
        'cantidad', ci.cantidad
      )
      ORDER BY p.nombre
    ) FILTER (WHERE p.nombre IS NOT NULL),
    '[]'::json
  ) as productos
from wp_compras c
join wp_compra_items ci on c.id = ci.compra_id
join wp_productos p on ci.producto_id = p.id
join wp_usuarios u on c.usuario_cedula = u.cedula
group by c.id, u.nombres, c.fecha_compra, c.total
order by c.fecha_compra desc;

ALTER TABLE wp_productos
ALTER COLUMN imagen_url SET DEFAULT 'https://link.storjshare.io/raw/15M6fjomdWMwh4cdbZx5YmDQpQsc8EN73sYKcfLodh6yz6PXEbNJe1WKFvKrwMotebVhRWPiihQoPEuKkaEt1reW5WhPwipmRZnqcfnA5Fq2A5NiMhief8rTrMtFWLimZCkGJp8CqpyA3CkXQZ6tZYrK5sC4Lgksbiq9BMwKnfxXWdH4smKmVNMgYkLyuEiA6gp6eJQv3dqPJnr7SrWepmbKTYQvSQTizqxxTrgj2HDLu6pde6NtYYbAmLArVx5W2fNNVg31w7Kc9nsReNx1HLf5yBhF9v7x9/tesis-webshop-bucket/default-image-product.webp';

INSERT INTO wp_productos (
    precio,
    existencias,
    categoria_id,
    nombre,
    descripcion,
    calificacion
  )
VALUES 
( 100, 10, 1, 'Diamond Ring',
  'Elegant design with sparkling diamonds. This is a description for Diamond Ring. It is a beautiful piece of jewelry.',
  5),
( 200, 5, 2, 'Gold Necklace',
  'Handcrafted 24K gold necklace. This is a description for Gold Necklace. It is a stunning piece of jewelry.',
  4),
( 150, 8, 1, 'Sapphire Earrings',
  'Exquisite sapphire stud earrings. This is a description for Sapphire Earrings. They are elegant and timeless.',
  4),
( 120, 12, 4, 'Pearl Bracelet',
  'Freshwater pearl bracelet. This is a description for Pearl Bracelet. It is a classic piece of jewelry.',
  5),
( 180, 6, 2, 'Ruby Pendant',
  'Vibrant ruby pendant on gold chain. This is a description for Ruby Pendant. It adds a pop of color to any outfit.',
  4),
( 250, 3, 3, 'Emerald Brooch',
  'Vintage emerald and diamond brooch. This is a description for Emerald Brooch. It is a unique piece of jewelry.',
  5),
( 300, 2, 3, 'Platinum Watch',
  'Luxury platinum automatic watch. This is a description for Platinum Watch. It is a high-end timepiece.',
  5),
( 90, 15, 1, 'Topaz Hairpin',
  'Delicate topaz hair accessory. This is a description for Topaz Hairpin. It is a beautiful hair accessory.',
  5);

insert into wp_compras (
  usuario_cedula,
  fecha_compra,
  total
) values
(29643469, '2023-10-01 10:00:00', 500),
(29643469, '2023-10-02 11:30:00', 300),
(29643469, '2023-10-03 14:15:00', 200),
(29643469, '2023-10-04 16:45:00', 400);

insert into wp_compra_items (
  compra_id,
  producto_id,
  cantidad
) values
(1, 1, 2), -- Diamond Ring
(1, 2, 1), -- Gold Necklace
(2, 3, 3), -- Sapphire Earrings
(2, 4, 1), -- Pearl Bracelet
(3, 5, 2), -- Ruby Pendant
(3, 6, 1), -- Emerald Brooch
(4, 7, 1), -- Platinum Watch
(4, 8, 5); -- Topaz Hairpin


select * from wp_productos;

select
  g.fecha_guardado,
  p.nombre,
  p.precio,
  p.descripcion,
  p.imagen_url,
  c.nombre as categoria
from wp_guardados g
join wp_productos p on g.producto_id = p.id
join wp_categorias c on p.categoria_id = c.id
where usuario_cedula = 29643469;

insert into wp_guardados (
  usuario_cedula,
  producto_id,
  fecha_guardado
) values
(29643469, 1, '2023-10-01 10:00:00'), -- Diamond Ring
(29643469, 2, '2023-10-02 11:30:00'), -- Gold Necklace
(29643469, 3, '2023-10-03 14:15:00'), -- Sapphire Earrings
(29643469, 4, '2023-10-04 16:45:00'); -- Pearl Bracelet

SELECT 
  p.id, 
  p.nombre, 
  p.precio, 
  p.descripcion, 
  p.imagen_url, 
  c.nombre AS categoria,
  EXISTS (
    SELECT 1 
    FROM wp_carritos ca 
    WHERE ca.id_producto = p.id and ca.usuario_cedula = 29
  ) AS en_carrito
FROM wp_productos p
JOIN wp_categorias c ON c.id = p.categoria_id;

SELECT
        p.id,
        p.nombre,
        p.precio,
        p.descripcion,
        p.imagen_url,
        c.nombre AS categoria,
        EXISTS (
          SELECT 1
          FROM wp_carritos ca
          WHERE ca.id_producto = p.id and ca.usuario_cedula = 29643469
        ) AS en_carrito,
        EXISTS (
          SELECT 1
          FROM wp_guardados g
          WHERE g.producto_id = p.id and g.usuario_cedula = 29643469
        ) AS en_guardados
      FROM wp_productos p
      JOIN wp_categorias c ON c.id = p.categoria_id;

delete from wp_carritos where usuario_cedula = 29643469 and id_producto = 1

ALTER TABLE wp_carritos
ADD COLUMN fecha_actualizacion TIMESTAMP DEFAULT NOW();

delete from wp_compras where usuario_cedula = 29643469

select p.*, c.nombre as categoria_nombre,
      EXISTS (
          SELECT 1
          FROM wp_carritos ca
          WHERE ca.id_producto = p.id and ca.usuario_cedula = 29643469
        ) AS en_carrito,
        EXISTS (
          SELECT 1
          FROM wp_guardados g
          WHERE g.producto_id = p.id and g.usuario_cedula = 29643469
        ) AS en_guardados
      from wp_productos p
      join wp_categorias c on c.id = p.categoria_id
      where p.id = 1;

CREATE TABLE wp_pedido (
  id SERIAL PRIMARY KEY,
  usuario_cedula INTEGER NOT NULL REFERENCES wp_usuarios(cedula),
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT NOT NULL,
  cantidad INTEGER NOT NULL DEFAULT 0 CHECK (cantidad >= 0),
  prioridad_id INTEGER NOT NULL REFERENCES wp_prioridad(id),
  fecha_cita TIMESTAMPTZ NOT NULL,
  fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  categoria_id INTEGER NOT NULL REFERENCES wp_categorias(id),
  
  CONSTRAINT valid_fecha_cita CHECK (fecha_cita > fecha_creacion)
);

CREATE INDEX idx_pedido_usuario ON wp_pedido(usuario_cedula);
CREATE INDEX idx_pedido_fecha_cita ON wp_pedido(fecha_cita);

ALTER TABLE wp_pedido
ADD CONSTRAINT fk_pedido_usuario
FOREIGN KEY (usuario_cedula)
REFERENCES wp_usuarios(cedula)
ON DELETE CASCADE;

ALTER TABLE wp_pedido
ADD CONSTRAINT fk_pedido_categoria
FOREIGN KEY (categoria_id)
REFERENCES wp_categorias(id)
ON DELETE SET NULL;

insert into wp_prioridad (nombre) values
('Sin recoger'),
('Recogido'),
('Enviado'),
('Entregado'),
('Cancelado'),
('En espera'),
('Reembolsado'),
('En revisión');

INSERT INTO wp_pedido (
    usuario_cedula,
    nombre,
    descripcion,
    cantidad,
    prioridad_id,
    fecha_cita,
    categoria_id
  )
VALUES (29643469, 'titulo test', 'descripcion test', 1, 6, null, 8);


select
  p.usuario_cedula,
  p.nombre,
  p.descripcion,
  p.cantidad,
  pr.nombre,
  ca.nombre,
  p.fecha_cita,
  p.fecha_creacion
from wp_pedido p
join wp_categorias ca on p.categoria_id = ca.id
join wp_prioridad pr on p.prioridad_id = pr.id
where p.usuario_cedula = 29643469;

INSERT INTO wp_compras (
    id,
    usuario_cedula,
    fecha_compra,
    total,
    total_bolivares,
    dolar
  )
VALUES (
    id:integer,
    usuario_cedula:integer,
    'fecha_compra:timestamp without time zone',
    total:numeric,
    total_bolivares:numeric,
    dolar:numeric
  );

ALTER TABLE wp_usuarios DROP CONSTRAINT telefono_unico;




SELECT
    -- Ventas por mes en todo el año actual (array de meses y array de conteos)
    (
        SELECT array_agg(TO_CHAR(mes, 'YYYY-MM')) 
        FROM generate_series(
            DATE_TRUNC('year', CURRENT_DATE),
            DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year' - INTERVAL '1 month',
            INTERVAL '1 month'
        ) AS mes
    ) AS meses_del_anio,
    
    (
        SELECT array_agg(COALESCE(ventas_count, 0))
        FROM generate_series(
            DATE_TRUNC('year', CURRENT_DATE),
            DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year' - INTERVAL '1 month',
            INTERVAL '1 month'
        ) AS mes
        LEFT JOIN (
            SELECT 
                DATE_TRUNC('month', fecha_compra) AS mes_venta,
                COUNT(*) AS ventas_count
            FROM wp_compras
            WHERE fecha_compra >= DATE_TRUNC('year', CURRENT_DATE)
            GROUP BY mes_venta
        ) v ON mes = v.mes_venta
    ) AS ventas_por_mes,
    
    -- Pedidos por mes en todo el año actual
    (
        SELECT array_agg(COALESCE(pedidos_count, 0))
        FROM generate_series(
            DATE_TRUNC('year', CURRENT_DATE),
            DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year' - INTERVAL '1 month',
            INTERVAL '1 month'
        ) AS mes
        LEFT JOIN (
            SELECT 
                DATE_TRUNC('month', fecha_creacion) AS mes_pedido,
                COUNT(*) AS pedidos_count
            FROM wp_pedido
            WHERE fecha_creacion >= DATE_TRUNC('year', CURRENT_DATE)
            GROUP BY mes_pedido
        ) p ON mes = p.mes_pedido
    ) AS pedidos_por_mes,
    
    -- Pedidos de esta semana
    (
        SELECT COUNT(*) 
        FROM wp_pedido
        WHERE fecha_creacion >= CURRENT_DATE - INTERVAL '7 days'
        AND fecha_creacion < CURRENT_DATE + INTERVAL '1 day'
    ) AS pedidos_ultima_semana;