
import { NextRequest, NextResponse } from "next/server";
import { uploadMiddleware, runMiddleware } from "@/lib/middleware";
import { query } from "@/lib/database/db";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ success: true, user: session.user });
}

export async function POST(request: NextRequest) {
  try {
    const response = new NextResponse();
    // Run the upload middleware
    await runMiddleware(request, response, uploadMiddleware);
    // Extract the fields from the request using formData
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const file = formData.get("file") as File | null;

    // Handle file storage path
    let imagePath: string | undefined;
    if (file) {
      const ext = file.name.split(".").pop();
      const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "");
      imagePath = `/uploads/${timestamp}.${ext}`;

      // Save the file to disk
      const buffer = Buffer.from(await file.arrayBuffer());
      const filePath = `./public${imagePath}`;
      require("fs").writeFileSync(filePath, buffer);
    }

    // SQL query to update the user profile
    const updateQuery = `
      UPDATE users
      SET name = $1, image = $2
      WHERE email = $3
      RETURNING *;
    `;

    const values = [name, imagePath, email];

    const result = await query(updateQuery, values);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const updatedUser = result.rows[0];
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update profile" },
      { status: 500 }
    );
  }
}
