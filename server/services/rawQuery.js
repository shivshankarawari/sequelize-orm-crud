function getEmployees(sqlQuery, sqlCountQuery, req, sequelize) {
    const pageSize = 4;
    const pageNumber = req.query.pageNo || 1;
    const search = JSON.parse(req.query.search);
    const sortValue = req.query.sortBy || 'GID';
    let sortType = 'asc';

    if (search.value) {
        sqlQuery += ` where ${search.field} like '${search.value}%'`;
    }

    if (sortValue === 'PROFLIE_CMP_FLG') {
        sortType = 'desc';
    }

    sqlQuery += ` ORDER BY ${sortValue} ${sortType} OFFSET ${pageSize * (pageNumber - 1)} ROWS FETCH NEXT ${pageSize} ROWS ONLY`;

    const countPromise = sequelize.query(sqlCountQuery, { type: sequelize.QueryTypes.SELECT });
    const dataPromise = sequelize.query(sqlQuery, { type: sequelize.QueryTypes.SELECT });

    return Promise.all([countPromise, dataPromise]).then((result) => {
        let obj = {
            totalCount: result[0][0].TotalCount,
            employees: result[1]
        };

        return Promise.resolve(obj);
    });
}

module.exports.Employee_Dashboard = function (req, sequelize) {
    let sqlQuery = 'SELECT * FROM Employee_Dashboard';
    let sqlCountQuery = 'SELECT Count(*) As TotalCount FROM Employee_Dashboard';
    return getEmployees(sqlQuery, sqlCountQuery, req, sequelize);
};

module.exports.Employee_Search = function (req, sequelize) {
    let sqlQuery = 'SELECT * FROM Employee_Full';
    let sqlCountQuery = 'SELECT Count(*) As TotalCount FROM Employee_Full';
    return getEmployees(sqlQuery, sqlCountQuery, req, sequelize);
};