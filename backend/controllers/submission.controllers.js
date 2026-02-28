import path from "path";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import SubmissionModel from "../models/submission.js";
import hackathonModel from "../models/hackathon.models.js";
import TeamModel from "../models/team.js";
import UserModel from "../models/user.models.js";
import s3Client from "../config/aws.js";
import mongoose from "mongoose";
// import cloudinary from "../config/cloudinary.js"; // COMMENTED OUT - USING AWS S3

// helper: get file extension
function getFileExtension(filename) {
  return path.extname(filename).slice(1).toLowerCase(); // e.g. ".pdf" → "pdf"
}

// ✅ helper: upload files to AWS S3
const uploadFiles = async (files, resourceType, hackathonId) => {
  if (!files || files.length === 0) return [];

  const uploads = await Promise.all(
    files.map(async (file) => {
      try {
        const fileExtension = getFileExtension(file.originalname);
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 9);
        const key = `hackathons/${hackathonId}/${resourceType}/${timestamp}-${randomString}-${file.originalname}`;

        // ✅ Upload to AWS S3
        const putObjectCommand = new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        });

        await s3Client.send(putObjectCommand);

        // ✅ Generate S3 URL
        const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${
          process.env.AWS_REGION || "ap-southeast-2"
        }.amazonaws.com/${key}`;

        return {
          public_id: key,
          url: url,
          resource_type: resourceType,
          format: fileExtension,
          original_filename: file.originalname,
          size: file.size,
        };
      } catch (error) {
        console.error(`Error uploading file ${file.originalname}:`, error);
        throw error;
      }
    })
  );

  return uploads;
};
// /* ✅ OLD CLOUDINARY CODE (COMMENTED OUT)
// const uploadFiles = async (files, resourceType, hackathonId) => {
//   if (!files || files.length === 0) return [];
//
//   const uploads = await Promise.all(
//     files.map(
//       (file) =>
//         new Promise((resolve, reject) => {
//           const stream = cloudinary.uploader.upload_stream(
//             {
//               resource_type: resourceType,
//               folder: `hackathons/${hackathonId}`,
//             },
//             (error, result) => {
//               if (error) return reject(error);
//               resolve({
//                 public_id: result.public_id,
//                 url: result.secure_url,
//                 resource_type: result.resource_type,
//                 format: result.format,
//                 original_filename: result.original_filename,
//                 size: result.bytes,
//               });
//             }
//           );
//           stream.end(file.buffer);
//         })
//     )
//   );
//
//   return uploads;
// };
// */

// export const submitHackathonSolution = async (req, res) => {
//   try {
//     const { hackathonId, repoUrl, userId } = req.body || {};
//     console.log("req.body =>", req.body);
//     console.log("req.files =>", req.files);
//     // ✅ validate repoUrl is an array with at least one element
//     if (!hackathonId || !Array.isArray(repoUrl) || repoUrl.length === 0) {
//       return res.status(400).json({
//         message: "Hackathon ID and at least one repo URL are required",
//       });
//     }
//     if (!hackathonId || !repoUrl) {
//       return res
//         .status(400)
//         .json({ message: "Hackathon ID and repo URL are required" });
//     }

//     // ✅ check hackathon exists
//     const hackathon = await hackathonModel.findById(hackathonId);
//     if (!hackathon) {
//       return res.status(404).json({ message: "Hackathon not found" });
//     }

//     // ✅ check if user is in a team
//     const team = await TeamModel.findOne({
//       hackathon: hackathonId,
//       $or: [{ leader: userId }, { members: userId }],
//     });

//     // Validate file types based on hackathon.allowedFileTypes (if provided)
//     if (req.files && hackathon.allowedFileTypes) {
//       for (const [field, files] of Object.entries(req.files)) {
//         const allowed = hackathon.allowedFileTypes[field] || [];
//         for (const file of files) {
//           const ext = getFileExtension(file.originalname);
//           if (!allowed.includes(ext)) {
//             return res.status(400).json({
//               message: `File type .${ext} is not allowed for ${field}. Allowed: ${allowed.join(
//                 ", "
//               )}`,
//             });
//           }
//         }
//       }
//     }

//     // ✅ upload files (if any)
//     const docs = await uploadFiles(req.files?.docs || [], "raw", hackathonId);
//     const images = await uploadFiles(
//       req.files?.images || [],
//       "image",
//       hackathonId
//     );
//     const videos = await uploadFiles(
//       req.files?.videos || [],
//       "video",
//       hackathonId
//     );

//     let submission;

//     if (team) {
//       // Only leader can submit
//       if (team.leader.toString() !== userId.toString()) {
//         return res
//           .status(403)
//           .json({ message: "Only the team leader can submit solution" });
//       }

//       // Prevent duplicate submission
//       submission = await SubmissionModel.findOne({
//         hackathon: hackathonId,
//         team: team._id,
//       });
//       if (submission) {
//         return res
//           .status(400)
//           .json({ message: "Team already submitted solution" });
//       }

//       // Save submission
//       submission = await SubmissionModel.create({
//         team: team._id,
//         hackathon: hackathonId,
//         repoUrl,
//         submittedBy: userId,
//         docs,
//         images,
//         videos,
//       });

//       hackathon.submissions.push(submission._id);
//       await hackathon.save();

//       // Update all team members
//       const allMembers = [team.leader, ...team.members];
//       await UserModel.updateMany(
//         { _id: { $in: allMembers } },
//         { $push: { submittedHackathons: submission._id } }
//       );
//     } else {
//       // Individual submission
//       submission = await SubmissionModel.findOne({
//         hackathon: hackathonId,
//         participant: userId,
//       });
//       if (submission) {
//         return res
//           .status(400)
//           .json({ message: "You already submitted solution" });
//       }

//       submission = await SubmissionModel.create({
//         participant: userId,
//         hackathon: hackathonId,
//         repoUrl,
//         submittedBy: userId,
//         docs,
//         images,
//         videos,
//       });

//       hackathon.submissions.push(submission._id);
//       await hackathon.save();

//       await UserModel.findByIdAndUpdate(userId, {
//         $push: { submittedHackathons: submission._id },
//       });
//     }

//     res.status(201).json({
//       message: "Solution submitted successfully",
//       submission,
//     });
//   } catch (error) {
//     console.error("Error submitting hackathon solution:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const submitHackathonSolution = async (req, res) => {
  try {
    const { hackathonId, repoUrl, userId } = req.body || {};

    if (!hackathonId || !userId) {
      return res.status(400).json({
        message: "Hackathon ID and userId are required",
      });
    }

    let repoUrls = [];

    try {
      repoUrls = JSON.parse(repoUrl || "[]");
    } catch {
      repoUrls = [repoUrl];
    }

    if (!Array.isArray(repoUrls) || repoUrls.length === 0 || !repoUrls[0]) {
      return res.status(400).json({
        message: "At least one repo URL is required",
      });
    }

    const hackathon = await hackathonModel.findById(hackathonId);

    if (!hackathon) {
      return res.status(404).json({ message: "Hackathon not found" });
    }

    const team = await TeamModel.findOne({
      hackathon: hackathonId,
      $or: [{ leader: userId }, { members: userId }],
    });

    let submission;

    if (team) {
      if (team.leader.toString() !== userId.toString()) {
        return res.status(403).json({
          message: "Only the team leader can submit solution",
        });
      }

      const existing = await SubmissionModel.findOne({
        hackathon: hackathonId,
        team: team._id,
      });

      if (existing) {
        return res.status(400).json({
          message: "Team already submitted solution",
        });
      }

      if (req.files && hackathon.allowedFileTypes) {
        for (const [field, files] of Object.entries(req.files)) {
          const allowed = hackathon.allowedFileTypes?.[field] || [];

          for (const file of files) {
            const ext = getFileExtension(file.originalname);
            if (allowed.length && !allowed.includes(ext)) {
              return res.status(400).json({
                message: `File type .${ext} not allowed for ${field}. Allowed: ${allowed.join(
                  ", "
                )}`,
              });
            }
          }
        }
      }

      const docs =
        req.files?.docs?.length > 0
          ? await uploadFiles(req.files.docs, "raw", hackathonId)
          : [];

      const images =
        req.files?.images?.length > 0
          ? await uploadFiles(req.files.images, "image", hackathonId)
          : [];

      const videos =
        req.files?.videos?.length > 0
          ? await uploadFiles(req.files.videos, "video", hackathonId)
          : [];

      submission = await SubmissionModel.create({
        team: team._id,
        hackathon: hackathonId,
        repoUrl: repoUrls,
        submittedBy: userId,
        docs,
        images,
        videos,
      });

      await hackathonModel.findByIdAndUpdate(hackathonId, {
        $addToSet: { submissions: submission._id },
      });

      const allMembers = [team.leader, ...team.members];

      await UserModel.updateMany(
        { _id: { $in: allMembers } },
        { $addToSet: { submittedHackathons: submission._id } }
      );
    } else {
      const existing = await SubmissionModel.findOne({
        hackathon: hackathonId,
        participant: userId,
      });

      if (existing) {
        return res.status(400).json({
          message: "You already submitted solution",
        });
      }

      if (req.files && hackathon.allowedFileTypes) {
        for (const [field, files] of Object.entries(req.files)) {
          const allowed = hackathon.allowedFileTypes?.[field] || [];

          for (const file of files) {
            const ext = getFileExtension(file.originalname);
            if (allowed.length && !allowed.includes(ext)) {
              return res.status(400).json({
                message: `File type .${ext} not allowed for ${field}. Allowed: ${allowed.join(
                  ", "
                )}`,
              });
            }
          }
        }
      }

      const docs =
        req.files?.docs?.length > 0
          ? await uploadFiles(req.files.docs, "raw", hackathonId)
          : [];

      const images =
        req.files?.images?.length > 0
          ? await uploadFiles(req.files.images, "image", hackathonId)
          : [];

      const videos =
        req.files?.videos?.length > 0
          ? await uploadFiles(req.files.videos, "video", hackathonId)
          : [];

      submission = await SubmissionModel.create({
        participant: userId,
        hackathon: hackathonId,
        repoUrl: repoUrls,
        submittedBy: userId,
        docs,
        images,
        videos,
      });

      await hackathonModel.findByIdAndUpdate(hackathonId, {
        $addToSet: { submissions: submission._id },
      });

      await UserModel.findByIdAndUpdate(userId, {
        $addToSet: { submittedHackathons: submission._id },
      });
    }

    return res.status(201).json({
      message: "Solution submitted successfully",
      submission,
    });
  } catch (error) {
    console.error("Error submitting hackathon solution:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getSubmissionStatus = async (req, res) => {
  try {
    const { hackathonId, teamId, userId } = req.query;

    if (!hackathonId || (!teamId && !userId)) {
      return res
        .status(400)
        .json({ message: "hackathonId and teamId or userId are required" });
    }

    // Look for either team submission or individual submission
    const submission = await SubmissionModel.findOne({
      hackathon: hackathonId,
      $or: [
        teamId ? { team: teamId } : null,
        userId ? { participant: userId } : null,
      ].filter(Boolean),
    });

    if (!submission) {
      return res.status(200).json({ submitted: false });
    }

    return res.status(200).json({
      submitted: true,
      submission,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getSubmissionById = async (req, res) => {
  try {
    const submission = await SubmissionModel.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }
    return res.json(submission);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const getSubmissionsByHackathon = async (req, res) => {
  try {
    const { hackathonId } = req.params;

    if (!hackathonId) {
      return res.status(400).json({ message: "hackathonId is required" });
    }

    const hackathon = await hackathonModel.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ message: "Hackathon not found" });
    }

    const submissions = await SubmissionModel.find({ hackathon: hackathonId })
      .populate({
        path: "participant",
        select: "name email",
      })
      .populate({
        path: "team",
        select: "name secretCode members leader",
        populate: {
          path: "members leader",
          select: "name email",
        },
      })
      .sort({ hackathonPoints: -1, submittedAt: 1 });

    const rankedSubmissions = submissions.map((sub, index) => ({
      rank: index + 1,
      ...sub.toObject(),
    }));

    return res.status(200).json({
      hackathon: hackathon.name,
      totalSubmissions: submissions.length,
      submissions: rankedSubmissions,
    });
  } catch (err) {
    console.error("Error fetching hackathon submissions:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};


export const updateSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { repoUrl, userId } = req.body;

    const submission = await SubmissionModel.findById(id);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    const hackathon = await hackathonModel.findById(submission.hackathon);

    const now = new Date();

    if (hackathon.submissionEndDate && now > hackathon.submissionEndDate) {
      return res.status(403).json({
        message: "Submission deadline passed",
      });
    }

    // 🔐 Authorization check
    if (submission.team) {
      const team = await TeamModel.findById(submission.team);

      if (team.leader.toString() !== userId.toString()) {
        return res.status(403).json({
          message: "Only team leader can update submission",
        });
      }
    } else {
      if (submission.participant.toString() !== userId.toString()) {
        return res.status(403).json({
          message: "Unauthorized",
        });
      }
    }

    // Validate file types
    if (req.files && hackathon.allowedFileTypes) {
      for (const [field, files] of Object.entries(req.files)) {
        const allowed = hackathon.allowedFileTypes?.[field] || [];

        for (const file of files) {
          const ext = getFileExtension(file.originalname);
          if (allowed.length && !allowed.includes(ext)) {
            return res.status(400).json({
              message: `File type .${ext} not allowed for ${field}`,
            });
          }
        }
      }
    }

    // Upload new files (complete overwrite)
    const docs =
      req.files?.docs?.length > 0
        ? await uploadFiles(req.files.docs, "raw", hackathon._id)
        : [];

    const images =
      req.files?.images?.length > 0
        ? await uploadFiles(req.files.images, "image", hackathon._id)
        : [];

    const videos =
      req.files?.videos?.length > 0
        ? await uploadFiles(req.files.videos, "video", hackathon._id)
        : [];

    let repoUrls = [];
    try {
      repoUrls = JSON.parse(repoUrl || "[]");
    } catch {
      repoUrls = [repoUrl];
    }

    // COMPLETE OVERWRITE
    submission.repoUrl = repoUrls;
    submission.docs = docs;
    submission.images = images;
    submission.videos = videos;
    submission.submittedBy = userId;

    await submission.save();

    return res.status(200).json({
      message: "Submission updated successfully",
      submission,
    });

  } catch (error) {
    console.error("Error updating submission:", error);
    return res.status(500).json({ message: "Server error" });
  }
};