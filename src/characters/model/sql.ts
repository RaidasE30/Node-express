const SELECT = `
SELECT 
  c.id, 
  c.sex, 
  JSON_OBJECT('beginner', b.beginner, 'End_game', b.end_game) as build, 
  c.price, 
  c.lvl, 
  JSON_ARRAYAGG(i.src) as inventory
  FROM inventory as i
  LEFT JOIN characters as c
  ON i.character_id = c.id
  LEFT JOIN builds as b
  ON c.build_id = b.id
`;
const GROUP = 'GROUP BY c.id;';
const WHERE_ID = 'WHERE c.id = ?';

const SQL = {
  SELECT,
  GROUP,
  WHERE_ID,
} as const;

export default SQL;
