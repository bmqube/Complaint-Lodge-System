package com.msit.nsucls;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.speech.RecognizerIntent;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.MenuItem;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.MultiAutoCompleteTextView;
import android.widget.Toast;

import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;

import com.msit.nsucls.api.APIManagerSingleton;
import com.msit.nsucls.api.listeners.ComplaineeListener;
import com.msit.nsucls.api.listeners.ComplaintLodgeListener;
import com.msit.nsucls.helpers.FileUtils;
import com.msit.nsucls.helpers.RetrofitHelper;
import com.msit.nsucls.helpers.StorageHandler;
import com.msit.nsucls.models.User;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Objects;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LodgeComplaint extends AppCompatActivity {

    MultiAutoCompleteTextView complaintAgainstField;
    AutoCompleteTextView complaintReviewerField;
    Button uploadButton;
    List<File> evidences = new ArrayList<>();
    ListView selectedFilesList;
    EditText complaintBody;
    private File cameraFile;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        ActionBar actionBar = getSupportActionBar();
        assert actionBar != null;
        actionBar.setDisplayHomeAsUpEnabled(true);
        setContentView(R.layout.activity_lodge_complaint);

        List<User> currSearchResult = new ArrayList<>();

        String userToken = StorageHandler.getDefaults("userToken", LodgeComplaint.this);
        String userSessionToken = StorageHandler.getDefaults("userSessionToken", LodgeComplaint.this);

        selectedFilesList = findViewById(R.id.listView);
        complaintAgainstField = findViewById(R.id.complaint_against_field);
        complaintReviewerField = findViewById(R.id.complaint_reviewer_field);
        complaintBody = findViewById(R.id.complaint_body);
//        selectedFilesList = findViewById(R.id.selected_files);
        uploadButton = findViewById(R.id.upload_btn);
        Button submitButton = findViewById(R.id.lodge_button);

        complaintAgainstField.setTokenizer(new MultiAutoCompleteTextView.CommaTokenizer());

        complaintAgainstField.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }

            @Override
            public void afterTextChanged(Editable editable) {
                String keyword = editable.toString();
                List<String> text = Arrays.asList(editable.toString().split("\\s*,\\s*"));
                if (text.size() > 0) {
                    keyword = text.get(text.size() - 1);
                }
                APIManagerSingleton.getApiManager(LodgeComplaint.this).getComplainee(userToken, userSessionToken, keyword, new ComplaineeListener() {
                    @Override
                    public void onResponse(List<User> list) {
                        currSearchResult.clear();
                        for (User currUser : list) {
                            if (!text.contains(currUser.toString())) {
                                currSearchResult.add(currUser);
                            }
                        }
                        ArrayAdapter<User> complaineeList = new ArrayAdapter<>(LodgeComplaint.this, android.R.layout.simple_dropdown_item_1line, currSearchResult);
                        complaintAgainstField.setAdapter(complaineeList);
                    }

                    @Override
                    public void onError(String e) {
                        Toast.makeText(LodgeComplaint.this, e, Toast.LENGTH_LONG).show();
                    }
                });
            }
        });
        complaintReviewerField.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }

            @Override
            public void afterTextChanged(Editable editable) {
                String keyword = editable.toString();
                APIManagerSingleton.getApiManager(LodgeComplaint.this).getReviewer(userToken, userSessionToken, keyword, new ComplaineeListener() {
                    @Override
                    public void onResponse(List<User> list) {
                        System.out.println(list.size());
                        List<User> finalList = new ArrayList<>();
                        for (User currUser : list) {
                            if (!editable.toString().isEmpty() && !currUser.toString().equals(editable.toString())) {
                                finalList.add(currUser);
                            }
                        }
                        ArrayAdapter<User> complaineeList = new ArrayAdapter<>(LodgeComplaint.this, android.R.layout.simple_dropdown_item_1line, finalList);
                        complaintReviewerField.setAdapter(complaineeList);

                    }

                    @Override
                    public void onError(String e) {
                        Toast.makeText(LodgeComplaint.this, e, Toast.LENGTH_LONG).show();
                    }
                });
            }
        });

        ImageView mic = findViewById(R.id.mic);

        mic.setOnClickListener(v -> {
            Intent intent
                    = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL,
                    RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE,
                    Locale.getDefault());
            intent.putExtra(RecognizerIntent.EXTRA_PROMPT, "Speech to text");

            try {
                startActivityForResult(intent, 107);
            } catch (Exception e) {
                Toast
                        .makeText(LodgeComplaint.this, " " + e.getMessage(),
                                Toast.LENGTH_SHORT)
                        .show();
            }
        });

        uploadButton.setOnClickListener(view -> {
            AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(LodgeComplaint.this);
            final String[] options = {"Camera", "Gallery", "Close"};
            alertDialogBuilder.setTitle("Choose Evidence");
            alertDialogBuilder.setItems(options, (dialogInterface, i) -> {
                if (options[i].equals("Gallery")) {
                    if (!(ContextCompat.checkSelfPermission(
                            LodgeComplaint.this, Manifest.permission.READ_EXTERNAL_STORAGE) ==
                            PackageManager.PERMISSION_GRANTED)) {
                        int requestCode = 0;
                        requestPermissions(new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE, Manifest.permission.READ_EXTERNAL_STORAGE}, requestCode);
                        System.out.println(requestCode);
                    }
                    Intent gallery = new Intent(Intent.ACTION_GET_CONTENT);
                    gallery.setType("image/* .pdf audio/* video/*");
                    gallery.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
                    startActivityForResult(gallery, 1);
                } else if (options[i].equals("Camera")) {
                    if (!(ContextCompat.checkSelfPermission(
                            LodgeComplaint.this, Manifest.permission.CAMERA) ==
                            PackageManager.PERMISSION_GRANTED)) {
                        int requestCode = 0;
                        requestPermissions(new String[]{Manifest.permission.CAMERA, Manifest.permission.READ_EXTERNAL_STORAGE}, requestCode);
                        System.out.println(requestCode);
                    }

                    Intent cameraIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                    cameraIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                    cameraFile = new File(Environment.getExternalStorageDirectory() + File.separator + "DCIM" + File.separator + "IMG" + new SimpleDateFormat("yyyyMMddHHmmss").format(new Date()) + ".png");

                    Uri uri = FileProvider.getUriForFile(LodgeComplaint.this, BuildConfig.APPLICATION_ID + ".provider", cameraFile);
                    cameraIntent.putExtra(MediaStore.EXTRA_OUTPUT, uri);
                    startActivityForResult(cameraIntent, 2);
                }
            });
            alertDialogBuilder.show();

        });

        submitButton.setOnClickListener(view -> {
            if (isOkay()) {
                String[] lisOfComplainee = complaintAgainstField.getText().toString().split("\\s*,\\s*");
                String reviewer = complaintReviewerField.getText().toString();
                String body = complaintBody.getText().toString();
                List<MultipartBody.Part> reqBody = new ArrayList<>();
                for (File currEvidence : evidences) {
                    System.out.println(currEvidence);
//                    File file = new File( currEvidence.getPath());
                    RequestBody requestBody = RequestBody.create(MediaType.parse("image/*"), currEvidence);
                    reqBody.add(MultipartBody.Part.createFormData("evidence", currEvidence.getName(), requestBody));
                }

                for (String s : lisOfComplainee) {
                    reqBody.add(MultipartBody.Part.createFormData("complaintAgainstList", s));
                }
                reqBody.add(MultipartBody.Part.createFormData("message", body));
                reqBody.add(MultipartBody.Part.createFormData("reviewer", reviewer));

                ComplaintLodgeListener complaintLodgeListener = RetrofitHelper.getClient().create(ComplaintLodgeListener.class);
                Call<ResponseBody> responseBodyCall = complaintLodgeListener.callMultipleUploadApi(userToken, userSessionToken, reqBody);
                responseBodyCall.enqueue(new Callback<ResponseBody>() {
                    @Override
                    public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                        Toast.makeText(LodgeComplaint.this, "Complaint Successfully Lodged", Toast.LENGTH_LONG).show();
                        Intent intent = new Intent(LodgeComplaint.this, MainActivity.class);
                        intent.addFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);
                        startActivity(intent);
                    }

                    @Override
                    public void onFailure(Call<ResponseBody> call, Throwable t) {
                        Toast.makeText(LodgeComplaint.this, t.toString(), Toast.LENGTH_LONG).show();
                    }
                });
            }
        });


    }

    public boolean isOkay() {
        if (complaintAgainstField.getText().toString().isEmpty()) {
            complaintAgainstField.setError("This field can not be empty");
            return false;
        }

        if (complaintReviewerField.getText().toString().isEmpty()) {
            complaintReviewerField.setError("This field can not be empty");
            return false;
        }

        if (complaintBody.getText().toString().isEmpty()) {
            complaintBody.setError("This field can not be empty");
            return false;
        }

        if (evidences.size() == 0) {
            uploadButton.setError("Evidence can not be empty");
            return false;
        }

        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == android.R.id.home) {
            onBackPressed();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (resultCode != RESULT_CANCELED) {

            if (requestCode == 1) {
                if (resultCode == RESULT_OK && data != null) {

                    if (data.getData() == null) {
                        int count = data.getClipData().getItemCount();
                        for (int i = 0; i < count; i++) {
                            Uri file = data.getClipData().getItemAt(i).getUri();
                            File originalFile = new File(FileUtils.getRealPath(this, file));
                            evidences.add(originalFile);
                        }
                    } else {
                        Uri file = data.getData();
                        File originalFile = new File(FileUtils.getRealPath(this, file));
                        evidences.add(originalFile);
                    }

                    ArrayAdapter<File> arrayAdapter = new ArrayAdapter<>(LodgeComplaint.this, android.R.layout.simple_list_item_1, evidences);

                    selectedFilesList.setAdapter(arrayAdapter);
                }
            } else if (requestCode == 2) {
                String imagePath = cameraFile.getPath();
                File originalFile = new File(imagePath);
                evidences.add(originalFile);
            } else if (requestCode == 107) {
                if (resultCode == RESULT_OK && data != null) {
                    ArrayList<String> result = data.getStringArrayListExtra(
                            RecognizerIntent.EXTRA_RESULTS);
                    complaintBody.setText(
                            Objects.requireNonNull(result).get(0));
                }
            }

        }
    }
}
