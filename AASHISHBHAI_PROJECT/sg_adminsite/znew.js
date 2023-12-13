const login = async (req, res, next) => {
    let connection = mysql.createPool(config);
    try {
        const body = req.body;
        let validData = await validate(req.body, usersValidationSchema);
        if (validData !== undefined) {
            logger.error({
                request: JSON.stringify(req.headers),
                message: validData
            });
            return res.status(400).send({
                StatusCode: 15,
                error: validData
            })
        }
        if (body.Username && body.Password) {
            const encryptdPassword = await Eencrypted(body.Password)

            // Fetch RoleId for the user based on Username and Encrypted Password
            let roleQuery = `SELECT RoleId FROM bousers WHERE Username = ? AND Password = ?`;
            let roleParams = [body.Username, encryptdPassword];
            let roleResult = await spCall(connection, roleQuery, roleParams);

            if (roleResult.error || !roleResult.data || roleResult.data.length === 0) {
                return res.status(401).send({
                    StatusCode: 4
                });
            }

            let roleId = roleResult.data[0].RoleId;

            // Check if roleId is either 1 or 4, else return an error
            if (roleId !== 1 && roleId !== 4) {
                return res.status(401).send({
                    StatusCode: 4 // Or any other appropriate status code
                });
            }


            let checkLogin = `CALL Login(?, ?,?, @StatusCode);select @StatusCode as StatusCode`;
            let params = [body.Username, encryptdPassword, roleId];



            let spResult = await spCall(connection, checkLogin, params);
            if (spResult.data[spResult.data.length - 1][0].StatusCode == 4) {
                return res.status(401).send({
                    StatusCode: 4
                })
            }
            if (spResult.error != null) {
                return res.status(401).send({
                    StatusCode: 4
                })
            }

            // let roleCheck = await getDataByField(connection, tableName, `Username = '${body.Username}'`, `RoleId`)
            // if (roleCheck.data[0][0].RoleId != 1) {
            //     return res.status(401).send({
            //         StatusCode: 1
            //     })
            // }
            let data = spResult.data;
            let maketkns = data[0][0].UserId + '/' + data[0][0].Username + '/' + data[0][0].Token;
            let encryptTokens = await Eencrypted(maketkns)
            data[3][0].Token = encryptTokens;
            data[3][0].pages = data[1];
            logger.fatal({
                request: JSON.stringify(req.headers),
                response: JSON.stringify(data[3][0])
            });
            res.status(200).json(
                data[3][0]
            )
        }
    } catch (error) {
        logger.error({
            StatusCode: 1
        });
        res.status(401).send({
            StatusCode: 1
        })
    } finally {
        connection.end();
    }
}