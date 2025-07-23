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
  c.usuario_cedula,
  c.fecha_compra,
  c.total,
  COALESCE(
    json_agg(
      json_build_object('producto_id', ci.producto_id)
    ) FILTER (WHERE ci.producto_id IS NOT NULL),
    '[]'::json
  ) productos
from wp_compras c
join wp_compra_items ci on c.id = ci.compra_id
group by c.id, c.usuario_cedula, c.fecha_compra, c.total;