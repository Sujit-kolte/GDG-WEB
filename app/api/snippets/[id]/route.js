import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import {Snippet} from "@/models/Snippet";
export async function DELETE(req,{params}){
    try{
        await dbConnect();
        const {id}=await params;
        const deletedSnippet=await Snippet.findByIdAndDelete(id);
        if(!deletedSnippet){
            return NextResponse.json(
                {success:false,error:"Snippet not found"},
                {status:404}
            );
        }
        return NextResponse.json(
            {success:true,message:"Snippet deleted successfully"},
            {status:200}
        );
    }
    catch(err){
        return NextResponse.json(
            {success:false,message:err.message},
            {status:500}
        )
    }
}