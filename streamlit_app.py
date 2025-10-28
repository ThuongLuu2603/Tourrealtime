import streamlit as st

st.title("TourRealtime - Demo")
st.write("Ứng dụng demo được deploy lên Streamlit Cloud.")

st.markdown("---")
st.write("Thêm dữ liệu mẫu hoặc giao diện ở đây.")

if st.button("Hello"):
    st.success("Bạn đã nhấn nút!")
