import { Model, DataTypes, type InferAttributes, type InferCreationAttributes } from '@sequelize/core';

import { Attribute, NotNull, PrimaryKey } from '@sequelize/core/decorators-legacy';

export class Premium extends Model<InferAttributes<Premium>, InferCreationAttributes<Premium>> {
    @Attribute(DataTypes.STRING)
    @PrimaryKey
    @NotNull
    declare code: string;
}
