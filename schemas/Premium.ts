import { Model, DataTypes, type InferAttributes, type InferCreationAttributes } from '@sequelize/core';

import { Attribute, AutoIncrement, NotNull, PrimaryKey } from '@sequelize/core/decorators-legacy';

export class Premium extends Model<InferAttributes<Premium>, InferCreationAttributes<Premium>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: number;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare code: string;
}
