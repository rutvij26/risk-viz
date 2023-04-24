import { NextResponse } from "next/server";
import { IRiskData } from "../../store/RiskStore";
import { parse } from 'csv-parse';
import fs from 'fs/promises';

interface data {
    data: IRiskData[];
}

const fetchData = async() => {
    const rows: IRiskData[] = [];
    const csv = await fs.readFile('./assets/sample_data.csv');

    const parser = parse(csv, {
        columns: true,
        skip_empty_lines: true,
    });


    parser.on('readable', () => {
        let row;
        while ((row = parser.read())) {
            const rowData: IRiskData = {
                assetName: row["Asset Name"],
                lat: parseFloat(row["Lat"]),
                long: parseFloat(row["Long"]),
                businessCategory: row["Business Category"],
                riskRating: parseFloat(row["Risk Rating"]),
                riskFactors: JSON.parse(row["Risk Factors"]) as Record<string, number>,
                year: parseInt(row["Year"]),
            };
            rows.push(rowData);
        }
    });

    return new Promise<IRiskData[]>((resolve, reject) => {
        parser.on("end", () => {
          resolve(rows);
        });
        parser.on("error", (err) => {
          reject(err);
        });
      });

    
}

export async function GET() {
    const rows = await fetchData();
    return NextResponse.json({data: rows});
}
