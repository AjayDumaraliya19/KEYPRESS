exports.joinsTwoTbl = async (
  connection,
  tb1,
  tb2,
  fields,
  cond1,
  whereCondition
) => {
  let obj = {
    error: null,
    data: null,
  };
  try {
    let query = `SELECT ${fields}
		FROM ${tb1} A
		JOIN ${tb2} B ON ${cond1}
		WHERE ${whereCondition}`;
    const data = await connection.query(query);
    const result = {
      data: data[0],
    };
    obj.data = result;
    return obj;
  } catch (error) {
    console.log("error", error);
    obj.error = error;
    return obj;
  }
};

exports.joinRounds = async (connection, GameId) => {
  let obj = {
    error: null,
    data: null,
  };
  try {
    let query = `SELECT r.RoundId, r.Result, r.SideResult,
			(SELECT rd.Card
			 FROM rounddetail rd
			 WHERE rd.RoundId = r.RoundId
			   AND rd.IsActive = 1
			   AND rd.IsDelete = 0			   
			 ORDER BY rd.RoundDetailId DESC
			 LIMIT 1) AS Card
		FROM round r
		WHERE r.Status in (3,5)
		  AND r.GameId = ${GameId}
		  AND r.IsActive = 1
		  AND r.IsDelete = 0
		ORDER BY r.RoundId DESC
		LIMIT 10;
		`;
    console.log(query);
    const data = await connection.query(query);
    obj.data = data[0];
    return obj;
  } catch (error) {
    console.log("error", error);
    obj.error = error;
    return obj;
  }
};

exports.joinsTwoTb = async (
  connection,
  tb1,
  tb2,
  fields,
  cond1,
  whereCondition,
  limit,
  page,
  body
) => {
  page = (page - 1) * limit;
  let obj = {
    error: null,
    data: null,
  };
  try {
    let query = `SELECT ${fields}
		FROM ${tb1} A
		JOIN ${tb2} B ON ${cond1}
		WHERE ${whereCondition}`;
    let countQuery = `SELECT COUNT(*) as TotalRecord
		FROM ${tb1} A
		JOIN ${tb2} B ON ${cond1}
		WHERE ${whereCondition}`;
    let params = [];

    if (body.Search && body.Search.Searchtext) {
      const searchValue = body.Search.Searchtext;
      const searchColumns = body.Search.Column.map(
        (col) => `${col} LIKE ?`
      ).join(" OR ");
      query += ` AND ${searchColumns}`;
      countQuery += ` AND (${searchColumns})`;
      params.push(...body.Search.Column.map(() => `%${searchValue}%`));
    }

    if (body.Sort && body.Sort.Column) {
      const sortColumn = `${body.Sort.Column}`;
      const sortOrder = body.Sort.Sortby.toUpperCase();
      query += ` ORDER BY ${sortColumn} ${sortOrder}`;
    }

    query += ` LIMIT ${limit} OFFSET ${page};`;
    params.push(limit, (page - 1) * limit);
    const data = await connection.query(query, params);
    const counts = await connection.query(countQuery, params);
    const result = {
      TotalRecord: counts[0][0].TotalRecord,
      data: data[0],
    };
    obj.data = result;
    return obj;
  } catch (error) {
    obj.error = error;
    return obj;
  }
};

exports.threeJoins = async (
  connection,
  tb1,
  tb2,
  tb3,
  fields,
  cond1,
  cond2,
  whereCondition,
  limit,
  page
) => {
  page = (page - 1) * limit;
  let obj = {
    error: null,
    data: null,
  };
  try {
    let sql = `SELECT ${fields}
		FROM ${tb1} A
		JOIN ${tb2} B ON ${cond1}
		JOIN ${tb3} C ON ${cond2} where ${whereCondition} LIMIT ${limit} OFFSET ${page}`;
    const data = await connection.query(sql);
    let countSql = `SELECT COUNT(*) as TotalRecord FROM ${tb1} WHERE IsDelete = 0`;
    const counts = await connection.query(countSql);
    const result = {
      TotalRecord: counts[0][0].TotalRecord,
      data: data[0],
    };
    obj.data = result;
    return obj;
  } catch (error) {
    obj.error = error;
    return obj;
  }
};

exports.joinQuery = async (connection, limit, page) => {
  page = (page - 1) * limit;
  let obj = {
    error: null,
    data: null,
  };
  try {
    let sql = `SELECT A.PermissionId,A.RoleId,A.PageId,C.Name as RoleName, B.Name as PageName, A.Action, A.IsActive+0 AS IsActive,A.CreatedOn
		FROM bopermission A
		JOIN bopages B ON B.PageId = A.PageId
		JOIN boroles C ON C.RoleId = A.RoleId where A.IsActive = 1 and A.IsDelete = 0 LIMIT ${limit} OFFSET ${page}`;
    const data = await connection.query(sql);
    let countSql = `SELECT COUNT(*) as TotalRecord FROM bopermission WHERE IsActive = 1 and IsDelete = 0`;
    const counts = await connection.query(countSql);
    const result = {
      TotalRecord: counts[0][0].TotalRecord,
      data: data[0],
    };
    obj.data = result;
    return obj;
  } catch (error) {
    obj.error = error;
    return obj;
  }
};
