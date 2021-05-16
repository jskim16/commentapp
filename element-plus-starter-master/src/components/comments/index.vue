<template>
  <div>
    <div class="flex">
      <div class="w-64">
        <el-input
          placeholder="사용자를 입력해주세요."
          v-model="commentUser"
        ></el-input>
      </div>
      <div class="w-64 ml-2">
        <el-input
          placeholder="Please input"
          v-model="commentText"
          @keyup.enter="addComment"
        ></el-input>
      </div>
      <div class="ml-4">
        <el-button type="primary" round @click="addComment">추가</el-button>
      </div>
    </div>
    <div v-for="c in comments" :key="`comments-${c.id}`">
      <div>
        {{ c.text }} === {{ c.createAt }}
        <i
          class="el-icon-delete cursor-pointer hover:text-green-600"
          @click="deleteComment(c)"
        ></i>
        <i
          class="el-icon-edit cursor-pointer hover:text-green-600"
          @click="openUpdate(c)"
        ></i>
        <i
          class="el-icon-chat-dot-square cursor-pointer hover:text-green-600"
          @click="openSubchat(c)"
        ></i>
      </div>
      <div v-if="c.subCommentInputFlag" class="flex">
        <div class="w-64">
          <el-input
            placeholder="사용자를 입력해주세요."
            v-model="c.subCommentInputUser"
          ></el-input>
        </div>
        <div class="w-64 ml-2">
          <el-input
            placeholder="Please input"
            v-model="c.subCommentInputText"
            @keyup.enter="addComment"
          ></el-input>
        </div>
        <div v-if="!c.updateCommentFlag" class="ml-4">
          <el-button type="primary" round @click="addSubComment(c)"
            >추가</el-button
          >
        </div>
        <div v-if="c.updateCommentFlag" class="ml-4">
          <el-button type="primary" round @click="updateComment(c)"
            >수정</el-button
          >
        </div>
      </div>
      <div v-for="s in c.subcomments" :key="`subcomment-${s.id}`" class="pl-4">
        {{ s.text }} === {{ c.createAt }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: {
    recompID: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      comments: [],
      commentText: "",
      commentUser: "",
    };
  },
  mounted() {
    this.getComments();
  },
  methods: {
    async getComments() {
      const res = await axios.get(
        `http://localhost:3000=comments?recompId=${this.recompId}&_embed=subcomments`
      );
      const reRes = res.data.map((c) => {
        c.subCommentInputFlag = false;
        c.subCommentInputUser = "";
        c.subCommentInputText = "";
        c.updateCommentFlag = false;
        return c;
      });
      this.comments = reRes;
    },
    async addComment() {
      if (!this.commentText || !this.commentUser) {
        this.$message({
          message: "혹시 입력하실거 안하셨나요?",
          type: "warning",
        });
        return;
      }
      await axios.post("http://localhost:3000/comments", {
        recompId: this.recompId,
        text: this.commentText,
        createAt: this.commentUser,
      });
      this.getComments();
      this.commentText = "";
    },
    deleteComment(c) {
      this.$confirm("선택한 댓글 삭제하실거에요?", "Warning", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(async () => {
          await axios.delete("http://localhost:3000/comments/" + c.id);
          this.$message({
            type: "success",
            message: "삭제 됐습니다.",
          });
          this.getComments();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "삭제를 취소합니다.",
          });
        });
    },
    updateComment(c) {
      if (!c.subCommentInputUser || !c.subCommentInputText) {
        this.$message({
          message: "혹시 입력하실거 안하셨나요?",
          type: "warning",
        });
        return;
      }
      c.text = c.subCommentInputText;
      c.createAt = c.subCommentInputUser;
      this.getComments();
      c.subCommentInputText = "";
    },
    openSubchat(c) {
      c.subCommentInputFlag = !c.subCommentInputFlag;
    },
    openUpdate(c) {
      c.subCommentInputFlag = !c.subCommentInputFlag;
      c.updateCommentFlag = !c.updateCommentFlag;
    },
    async addSubComment(c) {
      if (!c.subCommentInputUser || !c.subCommentInputText) {
        this.$message({
          message: "혹시 입력하실거 안하셨나요?",
          type: "warning",
        });
        return;
      }
      await axios.post("http://localhost:3000/subcomments", {
        commentId: c.id,
        text: c.subCommentInputText,
        createAt: c.subCommentInputUser,
      });
      this.getComments();
      c.subCommentInputText = "";
    },
  },
};
</script>

<style lang="scss" scoped></style>
