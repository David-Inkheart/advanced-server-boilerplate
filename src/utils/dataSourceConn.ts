import { DataSource } from "typeorm";
import { AppDataSource, TestDataSource } from "../data-source";

export const createDataSourceConn = async () => {
  let dataSourceOptions: DataSource | undefined;
  if (process.env.NODE_ENV === 'test') {
    dataSourceOptions = TestDataSource;
  }
  if (process.env.NODE_ENV === 'development') {
    dataSourceOptions = AppDataSource;
  }
  return dataSourceOptions!.initialize();
}
