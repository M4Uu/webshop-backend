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
  p.imagen_url
from wp_guardados g
join wp_productos p on g.producto_id = p.id
where usuario_cedula = 29643469;